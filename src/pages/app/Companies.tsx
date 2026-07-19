import { Link } from 'react-router-dom';
import { Building2, ExternalLink, CreditCard, Plus } from 'lucide-react';
import { useApi } from '../../lib/useApi';
import { gatewayUrl } from '../../lib/api';
import { money, toFaDigits } from '../../lib/format';
import { Card, ErrorState, Loading, PageHeader, StatusBadge } from './shared';

function CreateCompanyButton() {
  return (
    <Link
      to="/app/companies/create"
      className="flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl px-4 py-2.5 text-sm transition-colors"
    >
      <Plus size={18} /> ساخت کسب‌وکار جدید
    </Link>
  );
}

type Company = {
  id: number;
  name: string;
  panelUrl: string;
  statusLabel: string;
  statusColor: string;
  typeLabel: string;
  price: number;
  roleLabel: string;
  isOwner: boolean;
  payable: boolean;
  isActive: boolean;
  expiration: string | null;
};

export default function Companies() {
  const { data, loading, error, refetch } = useApi<{ items: Company[] }>('company/index');

  const payCompany = (id: number) => {
    // Full-page navigation to the gateway (SEP needs a top-level redirect).
    window.location.href = gatewayUrl('payments/company', { id });
  };

  return (
    <div>
      <PageHeader title="کسب‌وکارها" subtitle="پذیرنده‌هایی که مدیریت می‌کنید" action={<CreateCompanyButton />} />

      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorState msg={error} onRetry={refetch} />
      ) : !data?.items?.length ? (
        <div className="text-center py-16">
          <Building2 size={32} className="mx-auto text-slate-300 mb-3" />
          <p className="text-slate-600 font-bold">کسب‌وکاری ندارید</p>
          <p className="text-sm text-slate-400 mt-1 mb-5">برای شروع، یک پذیرنده جدید بسازید.</p>
          <div className="inline-flex"><CreateCompanyButton /></div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((c) => (
            <Card key={c.id} className="p-5 flex flex-col">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="grid place-items-center w-9 h-9 rounded-xl bg-primary/10 text-primary shrink-0">
                      <Building2 size={18} />
                    </span>
                    <h3 className="font-black text-slate-800 truncate">{c.name}</h3>
                  </div>
                </div>
                <StatusBadge text={c.statusLabel} tone={c.statusColor} />
              </div>

              <div className="flex flex-wrap gap-2 text-xs text-slate-500 mb-4">
                <span className="bg-slate-100 rounded-lg px-2 py-1 font-bold">{c.typeLabel}</span>
                <span className="bg-slate-100 rounded-lg px-2 py-1">{c.roleLabel}</span>
                {c.expiration && <span className="bg-slate-100 rounded-lg px-2 py-1" dir="ltr">{toFaDigits(c.expiration)}</span>}
              </div>

              <div className="mt-auto flex gap-2">
                {c.payable ? (
                  <button
                    onClick={() => payCompany(c.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl py-2.5 text-sm transition-colors"
                  >
                    <CreditCard size={16} /> پرداخت {money(c.price)} تومان
                  </button>
                ) : (
                  <a
                    href={c.panelUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 border border-primary text-primary hover:bg-primary/5 font-bold rounded-xl py-2.5 text-sm transition-colors"
                  >
                    <ExternalLink size={16} /> ورود به پنل
                  </a>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
