import { useState } from 'react';
import { CreditCard } from 'lucide-react';
import { useApi } from '../../lib/useApi';
import { gatewayUrl } from '../../lib/api';
import { money, toFaDigits } from '../../lib/format';
import { Card, EmptyState, ErrorState, Loading, PageHeader, StatusBadge } from './shared';

type Installment = {
  id: number;
  amount: number | string;
  penalty?: number | string;
  installment_date?: string;
  status?: number;
  statusText?: string;
  company?: { id: number; name?: string; title?: string };
  _links?: { pay?: { href?: string } };
  [k: string]: unknown;
};

// Progress (1) and overdue (3) installments can be paid; paid (2)/received (4) can't.
const PAYABLE_STATUSES = [1, 3];

// The merged list tags origin only via the pay link's ?type=.
function installmentType(it: Installment): 'regular' | 'irregular' {
  return it._links?.pay?.href?.includes('type=irregular') ? 'irregular' : 'regular';
}

type InstallmentsResponse = {
  items: Installment[];
  total: number;
  state: number;
  statesAlias: Record<string, string>;
};

// Mirrors CompanyInstallments::STATE_* constants.
const STATES = [
  { value: 1, label: 'این ماه' },
  { value: 2, label: 'آینده' },
  { value: 3, label: 'پرداخت‌شده' },
];

export default function Installments() {
  const [state, setState] = useState(1);
  const { data, loading, error, refetch } = useApi<InstallmentsResponse>('installments/index', {
    state,
    expand: 'company',
  });

  const pay = (it: Installment) => {
    // Full-page navigation to the gateway (SEP needs a top-level redirect).
    window.location.href = gatewayUrl('payments/installment', { id: it.id, type: installmentType(it) });
  };

  return (
    <div>
      <PageHeader title="اقساط" subtitle="اقساط شما بر اساس وضعیت" />

      <div className="flex gap-2 mb-5">
        {STATES.map((s) => (
          <button
            key={s.value}
            onClick={() => setState(s.value)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
              state === s.value ? 'bg-primary text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-primary'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <Card>
        {loading ? (
          <Loading />
        ) : error ? (
          <ErrorState msg={error} onRetry={refetch} />
        ) : !data?.items?.length ? (
          <EmptyState title="قسطی یافت نشد" hint="در این وضعیت قسطی ثبت نشده است." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 text-xs border-b border-slate-100">
                  <th className="text-right font-bold px-4 py-3">کسب‌وکار</th>
                  <th className="text-right font-bold px-4 py-3">مبلغ (تومان)</th>
                  <th className="text-right font-bold px-4 py-3">جریمه</th>
                  <th className="text-right font-bold px-4 py-3">تاریخ سررسید</th>
                  <th className="text-right font-bold px-4 py-3">وضعیت</th>
                  <th className="text-right font-bold px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((it) => (
                  <tr key={it.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                    <td className="px-4 py-3 font-semibold text-slate-700">
                      {it.company?.title || it.company?.name || '—'}
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900">{money(it.amount)}</td>
                    <td className="px-4 py-3 text-slate-500">{it.penalty ? money(it.penalty) : '—'}</td>
                    <td className="px-4 py-3 text-slate-500" dir="ltr">{toFaDigits(it.installment_date)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge text={it.statusText ?? '—'} tone={data.statesAlias?.[String(it.status)]} />
                    </td>
                    <td className="px-4 py-3 text-left">
                      {PAYABLE_STATUSES.includes(Number(it.status)) && (
                        <button
                          onClick={() => pay(it)}
                          className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg px-3 py-2 transition-colors"
                        >
                          <CreditCard size={15} /> پرداخت
                        </button>
                      )}
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
