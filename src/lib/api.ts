// Thin fetch wrapper for the Ghestit REST API (Yii2 app-api).
// Handles JWT bearer auth, JSON parsing, the api's {success,status,message,data}
// error envelope, and one transparent token refresh on 401.

export const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ||
  'http://api.ghestit.local';

const TOKEN_KEY = 'gst_token';
const REFRESH_KEY = 'gst_refresh';
const USER_KEY = 'gst_user';

export const tokenStore = {
  get token(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
  get refresh(): string | null {
    return localStorage.getItem(REFRESH_KEY);
  },
  getUser<T = any>(): T | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as T) : null;
  },
  set(token: string, refresh?: string | null, user?: unknown) {
    localStorage.setItem(TOKEN_KEY, token);
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
    if (user !== undefined) localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

export class ApiError extends Error {
  status: number;
  /** Per-field validation errors from Yii ActiveForm responses, when present. */
  fields?: Record<string, string[]>;
  data?: any;
  constructor(message: string, status: number, data?: any, fields?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    this.fields = fields;
  }
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined | null>;
  auth?: boolean; // attach bearer token (default true)
  signal?: AbortSignal;
};

function buildUrl(path: string, query?: RequestOptions['query']): string {
  const url = new URL(
    path.startsWith('http') ? path : `${API_BASE_URL}/${path.replace(/^\//, '')}`,
  );
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

// Yii validation errors come back as [{field, message}]; normalize to a map.
function parseFieldErrors(data: any): Record<string, string[]> | undefined {
  if (Array.isArray(data) && data.length && data[0]?.field) {
    const map: Record<string, string[]> = {};
    for (const e of data) {
      if (!e?.field) continue;
      (map[e.field] ??= []).push(e.message ?? 'خطا');
    }
    return map;
  }
  return undefined;
}

let refreshPromise: Promise<string | null> | null = null;

async function refreshToken(): Promise<string | null> {
  const urf = tokenStore.refresh;
  if (!urf) return null;
  // Dedupe concurrent refreshes.
  refreshPromise ??= (async () => {
    try {
      const res = await fetch(buildUrl('site/refresh-token'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urf_token: urf }),
      });
      const json = await res.json().catch(() => null);
      const token = json?.token ?? json?.data?.token;
      if (res.ok && token) {
        tokenStore.setToken(String(token));
        return String(token);
      }
      return null;
    } catch {
      return null;
    } finally {
      refreshPromise = null;
    }
  })();
  return refreshPromise;
}

async function doFetch(path: string, opts: RequestOptions, token: string | null): Promise<Response> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (opts.body !== undefined) headers['Content-Type'] = 'application/json';
  if (opts.auth !== false && token) headers['Authorization'] = `Bearer ${token}`;
  return fetch(buildUrl(path, opts.query), {
    method: opts.method ?? (opts.body !== undefined ? 'POST' : 'GET'),
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    signal: opts.signal,
  });
}

export async function apiRequest<T = any>(path: string, opts: RequestOptions = {}): Promise<T> {
  let res = await doFetch(path, opts, tokenStore.token);

  // One transparent refresh + retry on auth failure.
  if (res.status === 401 && opts.auth !== false && tokenStore.refresh) {
    const fresh = await refreshToken();
    if (fresh) {
      res = await doFetch(path, opts, fresh);
    }
  }

  const text = await res.text();
  const json = text ? (() => { try { return JSON.parse(text); } catch { return text; } })() : null;

  if (!res.ok) {
    // api wraps non-200 as {success,status,message,data}; data may hold field errors.
    const message =
      (json && typeof json === 'object' && (json.message || json.data?.message)) ||
      `خطای ${res.status}`;
    const fields = parseFieldErrors(json?.data) ?? parseFieldErrors(json);
    if (res.status === 401) tokenStore.clear();
    throw new ApiError(message, res.status, json, fields);
  }
  return json as T;
}

/** Multipart POST for file uploads (tickets). Token attached + one refresh retry. */
export async function apiUpload<T = any>(path: string, form: FormData, query?: RequestOptions['query']): Promise<T> {
  const send = (token: string | null) =>
    fetch(buildUrl(path, query), {
      method: 'POST',
      headers: token ? { Accept: 'application/json', Authorization: `Bearer ${token}` } : { Accept: 'application/json' },
      body: form,
    });

  let res = await send(tokenStore.token);
  if (res.status === 401 && tokenStore.refresh) {
    const fresh = await refreshToken();
    if (fresh) res = await send(fresh);
  }

  const text = await res.text();
  const json = text ? (() => { try { return JSON.parse(text); } catch { return text; } })() : null;
  if (!res.ok) {
    const message = (json && typeof json === 'object' && (json.message || json.data?.message)) || `خطای ${res.status}`;
    const fields = parseFieldErrors(json?.data) ?? parseFieldErrors(json);
    if (res.status === 401) tokenStore.clear();
    throw new ApiError(message, res.status, json, fields);
  }
  return json as T;
}

/**
 * Absolute URL for a gateway endpoint reached by full-page navigation (SEP needs
 * a top-level redirect, so auth rides as ?access-token= instead of a header).
 */
export function gatewayUrl(path: string, params?: Record<string, string | number>): string {
  const url = new URL(`${API_BASE_URL}/${path.replace(/^\//, '')}`);
  if (params) for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));
  if (tokenStore.token) url.searchParams.set('access-token', tokenStore.token);
  return url.toString();
}

/** Fetch a binary resource (e.g. contract PDF) with bearer auth + one refresh retry. */
export async function apiBlob(path: string, query?: RequestOptions['query']): Promise<Blob> {
  const send = (token: string | null) =>
    fetch(buildUrl(path, query), { headers: token ? { Authorization: `Bearer ${token}` } : {} });
  let res = await send(tokenStore.token);
  if (res.status === 401 && tokenStore.refresh) {
    const fresh = await refreshToken();
    if (fresh) res = await send(fresh);
  }
  if (!res.ok) throw new ApiError(`خطای ${res.status}`, res.status);
  return res.blob();
}

export const api = {
  get: <T = any>(path: string, query?: RequestOptions['query'], opts?: RequestOptions) =>
    apiRequest<T>(path, { ...opts, method: 'GET', query }),
  post: <T = any>(path: string, body?: unknown, opts?: RequestOptions) =>
    apiRequest<T>(path, { ...opts, method: 'POST', body }),
  delete: <T = any>(path: string, body?: unknown, opts?: RequestOptions) =>
    apiRequest<T>(path, { ...opts, method: 'DELETE', body }),
  upload: apiUpload,
};
