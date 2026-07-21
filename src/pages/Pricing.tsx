import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, ChevronDown, Minus, Sparkles } from 'lucide-react';
import { setPageSeo } from '../lib/seo';
import { cycleSuffix, priceOf, toman, usePlans, type Cycle, type Plan } from '../lib/plans';

/** Plans are ordered cheapest first; Pro is the one we point people at. */
const POPULAR_TYPE = 4;

const faqs: { q: string; a: string }[] = [
  {
    q: 'تفاوت پرداخت ماهانه و سالانه چیست؟',
    a: 'محتوای پلن دقیقاً یکی است؛ فقط دوره پرداخت فرق می‌کند. پرداخت سالانه ارزان‌تر تمام می‌شود، چون قیمت یک سال برابر ده ماه حساب می‌شود.',
  },
  {
    q: 'می‌توانم بعداً پلنم را ارتقا دهم؟',
    a: 'بله. در هر لحظه از داخل پنل می‌توانید به پلن بالاتر بروید و فقط مابه‌التفاوت روزهای باقی‌مانده اشتراک فعلی‌تان را می‌پردازید؛ تاریخ انقضا هم عقب نمی‌رود.',
  },
  {
    q: 'قبل از خرید می‌توانم امتحان کنم؟',
    a: 'بله. نسخه دمو رایگان است و همه قابلیت‌ها روی آن باز است. اطلاعاتی که در دوره دمو ثبت می‌کنید بعد از خرید حفظ می‌شود.',
  },
  {
    q: 'اگر بعد از خرید پشیمان شوم چه؟',
    a: 'پلن پایین‌تر در میانه دوره فعال نمی‌شود، ولی می‌توانید در پایان دوره پلن دیگری انتخاب کنید یا تمدید نکنید. مبلغ دوره جاری برگشت داده نمی‌شود.',
  },
  {
    q: 'هزینه پیامک‌ها جداست؟',
    a: 'هر پلن سهمیه پیامک رایگان دارد. بعد از اتمام سهمیه، پیامک‌ها بر اساس تعرفه اپراتور از کیف پول کسب‌وکار کم می‌شود.',
  },
  {
    q: 'درگاه پرداخت اختصاصی چطور فعال می‌شود؟',
    a: 'درگاه اختصاصی به شماره شبای ثبت‌شده کسب‌وکار شما وصل می‌شود و بعد از تایید بانک فعال می‌گردد. برای هماهنگی با پشتیبانی تماس بگیرید.',
  },
];

function CycleToggle({ cycle, onChange, freeMonths }: { cycle: Cycle; onChange: (c: Cycle) => void; freeMonths: number }) {
  return (
    <div className="inline-flex items-center bg-white border border-slate-200 rounded-2xl p-1 shadow-sm">
      {(['monthly', 'yearly'] as Cycle[]).map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          aria-pressed={cycle === c}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
            cycle === c ? 'bg-primary text-white' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {c === 'monthly' ? 'ماهانه' : 'سالانه'}
          {c === 'yearly' && freeMonths > 0 && (
            <span
              className={`mr-1.5 text-xs rounded-lg px-1.5 py-0.5 ${
                cycle === c ? 'bg-white/20' : 'bg-amber-100 text-amber-700'
              }`}
            >
              {new Intl.NumberFormat('fa-IR').format(freeMonths)} ماه رایگان
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

function PlanCard({ plan, cycle }: { plan: Plan; cycle: Cycle }) {
  const popular = plan.type === POPULAR_TYPE;
  const saving = plan.yearlySavingRial;

  return (
    <div
      className={`relative bg-white rounded-3xl border shadow-sm p-6 flex flex-col ${
        popular ? 'border-primary ring-1 ring-primary/20' : 'border-slate-100'
      }`}
    >
      {popular && (
        <span className="absolute -top-3 right-6 bg-primary text-white text-xs font-bold rounded-lg px-3 py-1 flex items-center gap-1">
          <Sparkles size={13} /> محبوب‌ترین
        </span>
      )}

      <h3 className="font-black text-slate-900 text-lg">{plan.label}</h3>

      <div className="mt-3 mb-1">
        <span className="text-2xl font-black text-slate-900">{toman(priceOf(plan, cycle))}</span>
        <span className="text-sm text-slate-500 mr-1">{cycleSuffix(cycle)}</span>
      </div>

      {cycle === 'yearly' && saving > 0 ? (
        <p className="text-xs text-primary font-bold">
          نسبت به پرداخت ماهانه {toman(saving)} کمتر
        </p>
      ) : (
        <p className="text-xs text-slate-400">+ مالیات بر ارزش افزوده</p>
      )}

      <ul className="mt-5 space-y-2 flex-1">
        {plan.features.map((f) => (
          <li key={f.key} className="flex items-center gap-2 text-sm">
            {f.included ? (
              <Check size={16} className="text-primary shrink-0" />
            ) : (
              <Minus size={16} className="text-slate-300 shrink-0" />
            )}
            <span className={f.included ? 'text-slate-700' : 'text-slate-400'}>{f.label}</span>
          </li>
        ))}
      </ul>

      <Link
        to={`/app/companies/create?type=${plan.type}&cycle=${cycle === 'monthly' ? 5 : 2}`}
        className={`mt-6 text-center font-bold rounded-xl py-3 text-sm transition-colors ${
          popular
            ? 'bg-primary hover:bg-primary-hover text-white'
            : 'border border-primary text-primary hover:bg-primary/5'
        }`}
      >
        انتخاب پلن {plan.label}
      </Link>
    </div>
  );
}

function ComparisonTable({ plans, cycle }: { plans: Plan[]; cycle: Cycle }) {
  // Every plan reports the same feature list, so the first one defines the rows.
  const rows = plans[0]?.features ?? [];
  if (!rows.length) return null;

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[34rem]">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-right font-black text-slate-700 px-5 py-3">قابلیت</th>
              {plans.map((p) => (
                <th key={p.type} className="px-4 py-3 text-center font-black text-slate-700">
                  <div>{p.label}</div>
                  <div className="text-xs font-bold text-slate-500 mt-0.5">{toman(priceOf(p, cycle))}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.key} className={i % 2 ? 'bg-slate-50/50' : ''}>
                <td className="px-5 py-3 text-slate-700">{row.label}</td>
                {plans.map((p) => {
                  const has = p.features.find((f) => f.key === row.key)?.included;
                  return (
                    <td key={p.type} className="px-4 py-3 text-center">
                      {has ? (
                        <Check size={17} className="text-primary inline" />
                      ) : (
                        <Minus size={17} className="text-slate-300 inline" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm divide-y divide-slate-100">
      {faqs.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between gap-3 text-right px-5 py-4 font-bold text-slate-800 hover:text-primary transition-colors"
            >
              {f.q}
              <ChevronDown
                size={18}
                className={`shrink-0 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {isOpen && <p className="px-5 pb-4 -mt-1 text-sm text-slate-600 leading-7">{f.a}</p>}
          </div>
        );
      })}
    </div>
  );
}

export default function Pricing() {
  const { plans, freeMonths, demoDays } = usePlans();
  const [cycle, setCycle] = useState<Cycle>('yearly');

  useEffect(() => {
    setPageSeo({
      title: 'تعرفه و پلن‌ها | قسطیت',
      description:
        'قیمت پلن‌های قسطیت برای فروش اقساطی: پایه، پلاس و پرو، با پرداخت ماهانه یا سالانه. مقایسه کامل قابلیت‌ها و پاسخ پرسش‌های رایج.',
      path: '/pricing',
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#fafafa]" dir="rtl">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-primary mb-6">
          <ArrowRight size={16} /> بازگشت به صفحه اصلی
        </Link>

        <header className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-900">تعرفه قسطیت</h1>
          <p className="text-slate-500 mt-2 leading-7">
            یک پلن انتخاب کنید و همان روز شروع کنید. هر پلن را می‌توانید
            {' '}{new Intl.NumberFormat('fa-IR').format(demoDays)} روز رایگان امتحان کنید.
          </p>
          <div className="mt-5">
            <CycleToggle cycle={cycle} onChange={setCycle} freeMonths={freeMonths} />
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-3 mb-12">
          {plans.map((p) => (
            <PlanCard key={p.type} plan={p} cycle={cycle} />
          ))}
        </div>

        <h2 className="text-xl font-black text-slate-900 mb-4">مقایسه کامل پلن‌ها</h2>
        <div className="mb-12">
          <ComparisonTable plans={plans} cycle={cycle} />
        </div>

        <h2 className="text-xl font-black text-slate-900 mb-4">پرسش‌های رایج</h2>
        <Faq />

        <div className="mt-12 bg-primary rounded-3xl p-8 text-center text-white">
          <h2 className="text-xl font-black mb-2">هنوز مطمئن نیستید؟</h2>
          <p className="text-white/85 text-sm leading-7 mb-5">
            نسخه دمو رایگان است و همه قابلیت‌ها روی آن باز است؛ بعد از خرید هم اطلاعاتتان حفظ می‌شود.
          </p>
          <Link
            to="/app/companies/create?type=1"
            className="inline-block bg-white text-primary font-bold rounded-xl px-6 py-3 text-sm hover:bg-white/90 transition-colors"
          >
            شروع رایگان دمو
          </Link>
        </div>
      </div>
    </div>
  );
}
