import { useState } from 'react';
import { FileText } from 'lucide-react';
import { useApi } from '../../lib/useApi';
import { apiBlob, ApiError } from '../../lib/api';
import { money, toFaDigits } from '../../lib/format';
import { Card, EmptyState, ErrorState, Loading, PageHeader, StatusBadge } from './shared';

type Credit = {
  id: number;
  amount?: number | string;
  created_at?: string;
  status?: number;
  statusText?: string;
  company?: { id: number; name?: string; title?: string };
  [k: string]: unknown;
};

type CreditsResponse = { items: Credit[]; total: number };

export default function Credits() {
  const { data, loading, error, refetch } = useApi<CreditsResponse>('credits/index', { expand: 'company' });
  const [downloading, setDownloading] = useState<number | null>(null);

  // Contract is a bearer-auth PDF; fetch as a blob and open it in a new tab.
  const openContract = async (id: number) => {
    setDownloading(id);
    try {
      const blob = await apiBlob('credits/contract', { id });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (e) {
      alert(e instanceof ApiError ? e.message : 'خطا در دریافت قرارداد');
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div>
      <PageHeader title="اعتبارها" subtitle="فهرست اعتبارها و خریدهای اقساطی شما" />
      <Card>
        {loading ? (
          <Loading />
        ) : error ? (
          <ErrorState msg={error} onRetry={refetch} />
        ) : !data?.items?.length ? (
          <EmptyState title="اعتباری یافت نشد" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 text-xs border-b border-slate-100">
                  <th className="text-right font-bold px-4 py-3">کسب‌وکار</th>
                  <th className="text-right font-bold px-4 py-3">مبلغ (تومان)</th>
                  <th className="text-right font-bold px-4 py-3">تاریخ ایجاد</th>
                  <th className="text-right font-bold px-4 py-3">وضعیت</th>
                  <th className="text-right font-bold px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((c) => (
                  <tr key={c.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                    <td className="px-4 py-3 font-semibold text-slate-700">
                      {c.company?.title || c.company?.name || '—'}
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900">{money(c.amount)}</td>
                    <td className="px-4 py-3 text-slate-500" dir="ltr">{toFaDigits(c.created_at)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge text={c.statusText ?? '—'} />
                    </td>
                    <td className="px-4 py-3 text-left">
                      <button
                        onClick={() => openContract(c.id)}
                        disabled={downloading === c.id}
                        className="inline-flex items-center gap-1.5 border border-slate-200 hover:border-primary hover:text-primary text-slate-600 text-xs font-bold rounded-lg px-3 py-2 transition-colors disabled:opacity-50"
                      >
                        <FileText size={15} /> {downloading === c.id ? 'در حال آماده‌سازی…' : 'قرارداد'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
