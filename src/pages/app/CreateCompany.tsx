import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { api, gatewayUrl, ApiError } from '../../lib/api';
import { useApi } from '../../lib/useApi';
import { money } from '../../lib/format';
import { Card, ErrorState, Loading, PageHeader } from './shared';
import LocationPicker from './LocationPicker';

type PlanType = { id: number; label: string; price: number; isPro: boolean };
type FormMeta = { types: PlanType[]; categories: string[]; provinces: { id: number; name: string }[]; proType: number };

export default function CreateCompany() {
  const navigate = useNavigate();
  const { data: meta, loading, error, refetch } = useApi<FormMeta>('company/form-meta');

  const [type, setType] = useState<number | null>(null);
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [host, setHost] = useState('');
  const [phone, setPhone] = useState('');
  const [iban, setIban] = useState('');
  const [provinceId, setProvinceId] = useState('');
  const [cityId, setCityId] = useState('');
  const [address, setAddress] = useState('');
  const [loc, setLoc] = useState<{ lat: number; lng: number } | null>(null);

  const [cities, setCities] = useState<{ id: number; name: string }[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Default to the first paid plan once meta loads.
  useEffect(() => {
    if (meta && type === null) setType(meta.types.find((t) => t.id > 1)?.id ?? meta.types[0]?.id ?? 1);
  }, [meta, type]);

  // Load cities when province changes.
  useEffect(() => {
    setCityId('');
    setCities([]);
    if (!provinceId) return;
    let active = true;
    api.get('company/cities', { province_id: provinceId })
      .then((r) => { if (active) setCities(r.items ?? []); })
      .catch(() => {});
    return () => { active = false; };
  }, [provinceId]);

  const selectedType = useMemo(() => meta?.types.find((t) => t.id === type), [meta, type]);
  const isPro = !!selectedType?.isPro;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setFormError(null);
    if (!loc) { setFormError('لطفاً موقعیت کسب‌وکار را روی نقشه انتخاب کنید.'); return; }
    setBusy(true);
    try {
      const res = await api.post('company/create', {
        CompanyForm: {
          type, business_category: category, name, host_name: host, phone,
          iban: isPro ? iban : '', province_id: provinceId, city_id: cityId,
          address, lat: loc.lat, long: loc.lng,
        },
      });
      if (res.payable) {
        // Paid plan -> gateway (full-page navigation).
        window.location.href = gatewayUrl('payments/company', { id: res.companyId });
        return;
      }
      navigate('/app/companies', { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        const fe: Record<string, string> = {};
        if (err.fields) for (const [k, v] of Object.entries(err.fields)) fe[k] = v[0];
        setFieldErrors(fe);
        setFormError(err.message);
      } else {
        setFormError('خطا در ساخت کسب‌وکار');
      }
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <Loading />;
  if (error || !meta) return <ErrorState msg={error || 'خطا'} onRetry={refetch} />;

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => navigate('/app/companies')} className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-primary mb-4">
        <ArrowRight size={16} /> بازگشت به کسب‌وکارها
      </button>
      <PageHeader title="ساخت کسب‌وکار جدید" subtitle="اطلاعات پذیرنده را وارد کنید" />

      <Card className="p-6">
        <form onSubmit={submit} className="space-y-5">
          {/* Plan */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {meta.types.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setType(t.id)}
                className={`rounded-xl border p-3 text-center transition-colors ${
                  type === t.id ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="font-black text-slate-800">{t.label}</div>
                <div className="text-[11px] text-slate-500 mt-1">{t.price ? `${money(t.price / 10000000)} م.ت / سال` : 'رایگان'}</div>
              </button>
            ))}
          </div>

          <Select label="دسته‌بندی صنف" value={category} onChange={setCategory} error={fieldErrors.business_category} options={meta.categories.map((c) => ({ value: c, label: c }))} placeholder="انتخاب کنید" />

          <Input label="نام کسب‌وکار" value={name} onChange={setName} error={fieldErrors.name} placeholder="مثلاً: فروشگاه فرش شاهکار" />

          <div>
            <Label text="آدرس وب‌سایت (زیردامنه)" />
            <div className="flex items-stretch">
              <span className="inline-flex items-center bg-slate-100 border border-l-0 border-slate-200 rounded-r-xl px-3 text-slate-500 text-sm" dir="ltr">.ghestit.com</span>
              <input value={host} onChange={(e) => setHost(e.target.value.replace(/[^a-zA-Z0-9-]/g, ''))} dir="ltr"
                placeholder="shahkar" className="flex-1 bg-slate-50 border border-slate-200 rounded-l-xl px-4 py-3 outline-none focus:border-primary text-left" />
            </div>
            <FieldError msg={fieldErrors.host_name} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="تلفن" value={phone} onChange={(v) => setPhone(v.replace(/\D/g, ''))} error={fieldErrors.phone} dir="ltr" />
            {isPro && <Input label="شماره شبا (IBAN)" value={iban} onChange={(v) => setIban(v.replace(/[^0-9]/g, ''))} error={fieldErrors.iban} dir="ltr" placeholder="بدون IR" />}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Select label="استان" value={provinceId} onChange={setProvinceId} error={fieldErrors.province_id} placeholder="انتخاب استان" options={meta.provinces.map((p) => ({ value: String(p.id), label: p.name }))} />
            <Select label="شهر" value={cityId} onChange={setCityId} error={fieldErrors.city_id} placeholder={provinceId ? 'انتخاب شهر' : 'ابتدا استان'} disabled={!provinceId} options={cities.map((c) => ({ value: String(c.id), label: c.name }))} />
          </div>

          <div>
            <Label text="آدرس" />
            <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={2}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-primary resize-none" />
            <FieldError msg={fieldErrors.address} />
          </div>

          <div>
            <Label text="موقعیت روی نقشه" />
            <LocationPicker value={loc} onChange={setLoc} />
            <FieldError msg={fieldErrors.lat || fieldErrors.long} />
          </div>

          {formError && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2">{formError}</p>}

          <button type="submit" disabled={busy}
            className="w-full bg-primary hover:bg-primary-hover text-white font-bold rounded-2xl py-3 transition-colors disabled:opacity-60">
            {busy ? 'در حال ثبت…' : selectedType?.price ? `ساخت و پرداخت ${money(selectedType.price)} تومان` : 'ساخت کسب‌وکار'}
          </button>
        </form>
      </Card>
    </div>
  );
}

function Label({ text }: { text: string }) {
  return <span className="text-sm font-bold text-slate-600 block mb-1.5">{text}</span>;
}
function FieldError({ msg }: { msg?: string }) {
  return msg ? <p className="text-xs text-red-600 mt-1">{msg}</p> : null;
}

function Input({ label, value, onChange, error, dir, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; error?: string; dir?: 'ltr' | 'rtl'; placeholder?: string;
}) {
  return (
    <label className="block">
      <Label text={label} />
      <input value={value} dir={dir} placeholder={placeholder} onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-primary" />
      <FieldError msg={error} />
    </label>
  );
}

function Select({ label, value, onChange, options, placeholder, error, disabled }: {
  label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[];
  placeholder?: string; error?: string; disabled?: boolean;
}) {
  return (
    <label className="block">
      <Label text={label} />
      <select value={value} disabled={disabled} onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-primary disabled:opacity-60">
        <option value="">{placeholder ?? 'انتخاب کنید'}</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <FieldError msg={error} />
    </label>
  );
}
