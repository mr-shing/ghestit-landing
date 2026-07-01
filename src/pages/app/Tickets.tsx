import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useApi } from '../../lib/useApi';
import { apiUpload, ApiError } from '../../lib/api';
import { toFaDigits } from '../../lib/format';
import { Card, EmptyState, ErrorState, Loading, PageHeader, StatusBadge, useFieldErrors, inputClass, FieldError } from './shared';

type TicketSummary = {
  id: string;
  title: string;
  typeLabel: string;
  statusLabel: string;
  statusColor: string;
  user_unread: number;
  created_at: number;
};

type IndexResponse = {
  items: TicketSummary[];
  typeList: Record<string, string>;
  statusList: Record<string, string>;
};

function faDate(ts?: number): string {
  if (!ts) return '—';
  try {
    return toFaDigits(new Intl.DateTimeFormat('fa-IR').format(new Date(ts * 1000)));
  } catch {
    return '—';
  }
}

export default function Tickets() {
  const { data, loading, error, refetch } = useApi<IndexResponse>('tickets/index');
  const [creating, setCreating] = useState(false);

  return (
    <div>
      <PageHeader
        title="پشتیبانی"
        subtitle="تیکت‌های پشتیبانی شما"
        action={
          <button
            onClick={() => setCreating(true)}
            className="flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl px-4 py-2.5 text-sm transition-colors"
          >
            <Plus size={18} /> تیکت جدید
          </button>
        }
      />

      <Card>
        {loading ? (
          <Loading />
        ) : error ? (
          <ErrorState msg={error} onRetry={refetch} />
        ) : !data?.items?.length ? (
          <EmptyState title="تیکتی ندارید" hint="برای ارتباط با پشتیبانی تیکت جدید بسازید." />
        ) : (
          <ul className="divide-y divide-slate-50">
            {data.items.map((t) => (
              <li key={t.id}>
                <Link to={`/app/tickets/${t.id}`} className="flex items-center justify-between gap-4 px-4 py-4 hover:bg-slate-50/60">
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 truncate flex items-center gap-2">
                      {t.title}
                      {t.user_unread > 0 && <span className="w-2 h-2 rounded-full bg-primary" title="پیام جدید" />}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{t.typeLabel} · {faDate(t.created_at)}</p>
                  </div>
                  <StatusBadge text={t.statusLabel} tone={t.statusColor} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {creating && (
        <CreateTicketModal
          typeList={data?.typeList ?? { '1': 'فنی', '2': 'عمومی', '3': 'فروش' }}
          onClose={() => setCreating(false)}
          onCreated={() => { setCreating(false); refetch(); }}
        />
      )}
    </div>
  );
}

function CreateTicketModal({
  typeList, onClose, onCreated,
}: { typeList: Record<string, string>; onClose: () => void; onCreated: () => void }) {
  const [type, setType] = useState(Object.keys(typeList)[0] ?? '1');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { errors, clearError, reset, showErrors, showApiErrors } = useFieldErrors(['title', 'description']);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'عنوان را وارد کنید';
    if (!description.trim()) errs.description = 'توضیحات را وارد کنید';
    if (Object.keys(errs).length) { showErrors(errs); return; }
    reset();

    setBusy(true);
    try {
      const fd = new FormData();
      fd.append('MgTicket[type]', type);
      fd.append('MgTicket[title]', title);
      fd.append('MgTicket[description]', description);
      if (files) Array.from(files).forEach((f) => fd.append('MgTicket[imageFiles][]', f));
      await apiUpload('tickets/create', fd);
      onCreated();
    } catch (e) {
      if (showApiErrors(e)) { /* field errors shown */ }
      else setError(e instanceof ApiError ? e.message : 'خطا در ثبت تیکت');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()} dir="rtl">
        <h2 className="text-lg font-black mb-4">تیکت جدید</h2>
        <form onSubmit={submit} className="space-y-4">
          <label className="block">
            <span className="text-sm font-bold text-slate-600">نوع</span>
            <select value={type} onChange={(e) => setType(e.target.value)} className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-primary">
              {Object.entries(typeList).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-bold text-slate-600">عنوان</span>
            <input id="title" value={title} onChange={(e) => { setTitle(e.target.value); clearError('title'); }} aria-invalid={!!errors.title} className={inputClass(!!errors.title, 'mt-1')} />
            <FieldError id="title-error" msg={errors.title} />
          </label>
          <label className="block">
            <span className="text-sm font-bold text-slate-600">توضیحات</span>
            <textarea id="description" value={description} onChange={(e) => { setDescription(e.target.value); clearError('description'); }} rows={4} aria-invalid={!!errors.description} className={inputClass(!!errors.description, 'mt-1 resize-none')} />
            <FieldError id="description-error" msg={errors.description} />
          </label>
          <label className="block">
            <span className="text-sm font-bold text-slate-600">تصاویر (اختیاری)</span>
            <input type="file" multiple accept="image/*" onChange={(e) => setFiles(e.target.files)} className="mt-1 w-full text-sm" />
          </label>
          {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2">{error}</p>}
          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={busy} className="flex-1 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl py-3 disabled:opacity-60">
              {busy ? 'در حال ثبت…' : 'ثبت تیکت'}
            </button>
            <button type="button" onClick={onClose} className="px-5 rounded-xl border border-slate-200 font-bold text-slate-600">انصراف</button>
          </div>
        </form>
      </div>
    </div>
  );
}
