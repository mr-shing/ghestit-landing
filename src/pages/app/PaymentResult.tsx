import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function PaymentResult() {
  const [params] = useSearchParams();
  const ok = params.get('status') === 'ok';
  const message = params.get('message') || (ok ? 'پرداخت با موفقیت انجام شد.' : 'پرداخت ناموفق بود.');

  return (
    <div className="max-w-md mx-auto text-center py-12">
      <div
        className={`mx-auto mb-5 grid place-items-center w-20 h-20 rounded-full ${
          ok ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
        }`}
      >
        {ok ? <CheckCircle2 size={44} /> : <XCircle size={44} />}
      </div>
      <h1 className="text-xl font-black text-slate-900 mb-2">{ok ? 'پرداخت موفق' : 'پرداخت ناموفق'}</h1>
      <p className="text-slate-500 leading-7">{message}</p>
      <div className="flex items-center justify-center gap-3 mt-8">
        <Link to="/app/installments" className="bg-primary hover:bg-primary-hover text-white font-bold rounded-xl px-5 py-2.5 text-sm transition-colors">
          بازگشت به اقساط
        </Link>
        <Link to="/app/credits" className="border border-slate-200 text-slate-600 font-bold rounded-xl px-5 py-2.5 text-sm">
          اعتبارها
        </Link>
      </div>
    </div>
  );
}
