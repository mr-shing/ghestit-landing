import { useEffect, useState } from 'react';
import { api, ApiError } from '../../lib/api';
import { Card, PageHeader } from './shared';

export default function ChangePassword() {
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeat] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // Trigger the confirmation SMS when the page opens.
  useEffect(() => {
    api.get('site/change-password')
      .then((r) => setNotice(r?.message ?? 'کد تأیید به موبایل شما ارسال شد.'))
      .catch(() => setNotice('کد تأیید به موبایل شما ارسال شد.'));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== repeatPassword) {
      setError('رمز عبور و تکرار آن یکسان نیستند');
      return;
    }
    setBusy(true);
    try {
      await api.post('site/change-password', {
        ChangePasswordForm: { password, repeatPassword, code },
      });
      setDone(true);
    } catch (e) {
      if (e instanceof ApiError) {
        setError((e.fields && Object.values(e.fields)[0]?.[0]) || e.message);
      } else {
        setError('خطا در تغییر رمز عبور');
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <PageHeader title="تغییر رمز عبور" />
      <Card className="p-6">
        {done ? (
          <p className="text-center text-emerald-600 font-bold py-6">رمز عبور با موفقیت تغییر کرد.</p>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            {notice && <p className="text-sm text-sky-700 bg-sky-50 rounded-xl px-3 py-2">{notice}</p>}
            <Input label="رمز عبور جدید" type="password" value={password} onChange={setPassword} />
            <Input label="تکرار رمز عبور" type="password" value={repeatPassword} onChange={setRepeat} />
            <Input label="کد پیامک" value={code} onChange={(v) => setCode(v.replace(/\D/g, '').slice(0, 6))} dir="ltr" />
            {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2">{error}</p>}
            <button
              type="submit"
              disabled={busy}
              className="w-full bg-primary hover:bg-primary-hover text-white font-bold rounded-2xl py-3 transition-colors disabled:opacity-60"
            >
              {busy ? 'در حال ثبت…' : 'تغییر رمز عبور'}
            </button>
          </form>
        )}
      </Card>
    </div>
  );
}

function Input({
  label, value, onChange, type = 'text', dir,
}: { label: string; value: string; onChange: (v: string) => void; type?: string; dir?: 'ltr' | 'rtl' }) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-slate-600">{label}</span>
      <input
        type={type}
        dir={dir}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
      />
    </label>
  );
}
