import { useCallback, useEffect, useRef, useState } from 'react';
import { api, ApiError } from './api';

type State<T> = { data: T | null; loading: boolean; error: string | null };

/** Fetch-on-mount helper with abort, refetch, and ApiError message extraction. */
export function useApi<T = any>(path: string, query?: Record<string, string | number | boolean | undefined | null>) {
  const [state, setState] = useState<State<T>>({ data: null, loading: true, error: null });
  // Stable key so the effect doesn't loop on a fresh query object each render.
  const key = JSON.stringify(query ?? {});
  const ctrl = useRef<AbortController | null>(null);

  const run = useCallback(async () => {
    ctrl.current?.abort();
    const controller = new AbortController();
    ctrl.current = controller;
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await api.get<T>(path, query, { signal: controller.signal });
      if (!controller.signal.aborted) setState({ data, loading: false, error: null });
    } catch (e) {
      if (controller.signal.aborted) return;
      const msg = e instanceof ApiError ? e.message : 'خطا در ارتباط با سرور';
      setState({ data: null, loading: false, error: msg });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, key]);

  useEffect(() => {
    run();
    return () => ctrl.current?.abort();
  }, [run]);

  return { ...state, refetch: run };
}
