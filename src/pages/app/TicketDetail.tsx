import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, Send, XCircle } from 'lucide-react';
import { useApi } from '../../lib/useApi';
import { apiUpload, ApiError } from '../../lib/api';
import { Card, ErrorState, Loading, StatusBadge, useFieldErrors, inputClass, FieldError } from './shared';

type Message = { sender: 'user' | 'support'; message: string; attachments?: string[]; created_at?: number };
type Ticket = {
  id: string;
  title: string;
  typeLabel: string;
  statusLabel: string;
  statusColor: string;
  description: string;
  attachments: string[];
  messages: Message[];
  isClosed: boolean;
};

export default function TicketDetail() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useApi<{ ticket: Ticket }>(`tickets/view`, { id });
  const [reply, setReply] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const { errors, clearError, reset, showErrors, showApiErrors } = useFieldErrors(['message']);

  const ticket = data?.ticket;

  const sendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim()) { showErrors({ message: 'متن پاسخ را وارد کنید' }); return; }
    reset();
    setBusy(true);
    setActionError(null);
    try {
      const fd = new FormData();
      fd.append('message', reply);
      if (files) Array.from(files).forEach((f) => fd.append('replyImages[]', f));
      await apiUpload('tickets/reply', fd, { id });
      setReply('');
      setFiles(null);
      refetch();
    } catch (e) {
      if (showApiErrors(e)) { /* field errors shown */ }
      else setActionError(e instanceof ApiError ? e.message : 'خطا در ارسال پاسخ');
    } finally {
      setBusy(false);
    }
  };

  const closeTicket = async () => {
    setBusy(true);
    try {
      await apiUpload('tickets/close', new FormData(), { id });
      refetch();
    } catch {
      setActionError('خطا در بستن تیکت');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Link to="/app/tickets" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-primary mb-4">
        <ArrowRight size={16} /> بازگشت به تیکت‌ها
      </Link>

      {loading ? (
        <Loading />
      ) : error || !ticket ? (
        <ErrorState msg={error || 'تیکت یافت نشد'} onRetry={refetch} />
      ) : (
        <>
          <Card className="p-5 mb-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-xl font-black text-slate-900">{ticket.title}</h1>
                <p className="text-xs text-slate-400 mt-1">{ticket.typeLabel}</p>
              </div>
              <StatusBadge text={ticket.statusLabel} tone={ticket.statusColor} />
            </div>
            <p className="text-slate-700 mt-3 whitespace-pre-wrap leading-7">{ticket.description}</p>
            <Attachments items={ticket.attachments} />
          </Card>

          <div className="space-y-3 mb-4">
            {ticket.messages?.map((m, i) => (
              <div key={i} className={`flex ${m.sender === 'user' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${m.sender === 'user' ? 'bg-white border border-slate-100' : 'bg-primary/10'}`}>
                  <p className="text-xs font-bold mb-1 text-slate-400">{m.sender === 'user' ? 'شما' : 'پشتیبانی'}</p>
                  <p className="text-slate-700 whitespace-pre-wrap leading-7">{m.message}</p>
                  <Attachments items={m.attachments} />
                </div>
              </div>
            ))}
          </div>

          {actionError && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2 mb-3">{actionError}</p>}

          {ticket.isClosed ? (
            <p className="text-center text-slate-400 py-4 font-bold">این تیکت بسته شده است.</p>
          ) : (
            <Card className="p-4">
              <form onSubmit={sendReply} className="space-y-3">
                <textarea
                  id="message"
                  value={reply}
                  onChange={(e) => { setReply(e.target.value); clearError('message'); }}
                  rows={3}
                  placeholder="پاسخ خود را بنویسید…"
                  aria-invalid={!!errors.message}
                  className={inputClass(!!errors.message, 'resize-none')}
                />
                <FieldError id="message-error" msg={errors.message} />
                <input type="file" multiple accept="image/*" onChange={(e) => setFiles(e.target.files)} className="text-sm" />
                <div className="flex gap-2">
                  <button type="submit" disabled={busy || !reply.trim()} className="flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl px-5 py-2.5 text-sm disabled:opacity-60">
                    <Send size={16} /> ارسال
                  </button>
                  <button type="button" onClick={closeTicket} disabled={busy} className="flex items-center gap-1.5 text-red-500 font-bold rounded-xl px-4 py-2.5 text-sm hover:bg-red-50">
                    <XCircle size={16} /> بستن تیکت
                  </button>
                </div>
              </form>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

function Attachments({ items }: { items?: string[] }) {
  if (!items?.length) return null;
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {items.map((src, i) => (
        <a key={i} href={src} target="_blank" rel="noreferrer">
          <img src={src} alt="پیوست" className="w-20 h-20 object-cover rounded-lg border border-slate-100" />
        </a>
      ))}
    </div>
  );
}
