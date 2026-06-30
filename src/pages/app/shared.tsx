// Small shared UI primitives for the ported app pages.
import type { ReactNode } from 'react';

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
