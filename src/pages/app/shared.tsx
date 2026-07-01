// Small shared UI primitives for the ported app pages.
import { useState, type ReactNode } from 'react';
import { ApiError } from '../../lib/api';

// ---------------------------------------------------------------------------
// Form validation helpers — shared danger styling + scroll-to-first-error.
// Give each field an `id` matching its error key so scroll/focus can find it.
// ---------------------------------------------------------------------------

export type FieldErrors = Record<string, string>;

/** Scroll to (and focus) the first field with an error. `order` fixes precedence. */
export function scrollToFirstError(errs: FieldErrors, order?: string[]) {
  const keys = (order ?? Object.keys(errs)).filter((k) => errs[k]);
  if (!keys.length) return;
  const el = document.getElementById(keys[0]);
  el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  (el as HTMLElement | null)?.focus?.({ preventScroll: true });
}

/** Field-error state + helpers used by every form. */
export function useFieldErrors(order?: string[]) {
  const [errors, setErrors] = useState<FieldErrors>({});
  const clearError = (name: string) => setErrors((p) => (p[name] ? { ...p, [name]: '' } : p));
  const reset = () => setErrors({});
  const showErrors = (errs: FieldErrors) => {
    setErrors(errs);
    scrollToFirstError(errs, order);
  };
  /** Map an ApiError's field errors and scroll. Returns true when it was field-level. */
  const showApiErrors = (e: unknown) => {
    if (e instanceof ApiError && e.fields && Object.keys(e.fields).length) {
      const mapped: FieldErrors = {};
      for (const [k, v] of Object.entries(e.fields)) mapped[k] = v?.[0] ?? '';
      showErrors(mapped);
      return true;
    }
    return false;
  };
  return { errors, setErrors, clearError, reset, showErrors, showApiErrors };
}

/** Input/select/textarea class with red danger state when `hasError`. */
export function inputClass(hasError?: boolean, extra = '') {
  const tone = hasError
    ? 'bg-red-50 border-2 border-red-400 focus:border-red-500'
    : 'bg-slate-50 border border-slate-200 focus:border-primary';
  return `w-full rounded-xl px-4 py-3 outline-none transition-colors ${tone} ${extra}`;
}

/** Red inline error message shown under a field. */
export function FieldError({ id, msg }: { id?: string; msg?: string }) {
  return msg ? <p id={id} className="mt-1 text-sm text-red-600 font-medium">{msg}</p> : null;
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm ${className}`}>{children}</div>
  );
}

export function Loading({ label = 'در حال بارگذاری…' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center py-16 text-slate-400 gap-3">
      <span className="w-5 h-5 border-2 border-slate-200 border-t-primary rounded-full animate-spin" />
      {label}
    </div>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="text-center py-16">
      <p className="text-slate-600 font-bold">{title}</p>
      {hint && <p className="text-sm text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}

export function ErrorState({ msg, onRetry }: { msg: string; onRetry?: () => void }) {
  return (
    <div className="text-center py-16">
      <p className="text-red-600 font-bold">{msg}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-3 text-sm text-primary font-bold hover:underline">
          تلاش مجدد
        </button>
      )}
    </div>
  );
}

const statusStyles: Record<string, string> = {
  warning: 'bg-amber-100 text-amber-700',
  success: 'bg-emerald-100 text-emerald-700',
  danger: 'bg-red-100 text-red-700',
  primary: 'bg-sky-100 text-sky-700',
  default: 'bg-slate-100 text-slate-600',
};

export function StatusBadge({ text, tone }: { text: string; tone?: string }) {
  const key = (tone || 'default').split(' ')[0];
  return (
    <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold ${statusStyles[key] || statusStyles.default}`}>
      {text}
    </span>
  );
}
