// Env-driven external URLs. Override per-environment via .env files
// (VITE_PANEL_URL). Falls back to local host in dev, production host in prod build.

export const PANEL_URL: string =
  (import.meta.env.VITE_PANEL_URL as string | undefined)?.replace(/\/$/, '') ||
  (import.meta.env.PROD ? 'https://panel.ghestit.com' : 'http://backend.ghestit.local');

/** Build an absolute panel URL, e.g. panelUrl('/company/create?type=1'). */
export const panelUrl = (path = '/'): string => `${PANEL_URL}${path.startsWith('/') ? path : `/${path}`}`;
