import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, KeyRound, MessageSquare, Phone, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { ApiError } from '../../lib/api';
import { useFieldErrors, FieldError } from '../app/shared';

type Step = 'phone' | 'password' | 'otp' | 'signup' | 'forgot' | 'reset';

const RESEND_SECONDS = 90;
// Prefill the login field with the last-used phone number. Only the phone is
// stored — never the password.
const LAST_PHONE_KEY = 'gst_last_phone';

export default function Login() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: string } };
  const redirectTo = location.state?.from || '/app/installments';

  const [step, setStep] = useState<Step>('phone');
  const [username, setUsername] = useState(() => localStorage.getItem(LAST_PHONE_KEY) ?? '');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [code, setCode] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const { errors, clearError, reset: resetErrors, showErrors, showApiErrors } =
    useFieldErrors(['username', 'full_name', 'code', 'password', 'repeatPassword']);

  const timer = useRef<number | null>(null);
  const startResendTimer = () => {
    setResendIn(RESEND_SECONDS);
    if (timer.current) window.clearInterval(timer.current);
    timer.current = window.setInterval(() => {
      setResendIn((s) => {
        if (s <= 1 && timer.current) window.clearInterval(timer.current);
        return s - 1;
      });
    }, 1000);
  };
  useEffect(() => () => { if (timer.current) window.clearInterval(timer.current); }, []);

  const fail = (e: unknown, fallback = 'خطایی رخ داد') => {
    if (showApiErrors(e)) return;
    if (e instanceof ApiError) setError(e.message || fallback);
    else setError(fallback);
  };
  const goto = (s: Step) => { setError(null); resetErrors(); setCode(''); setPassword(''); setStep(s); };
  const done = () => navigate(redirectTo, { replace: true });

  const submitPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); resetErrors();
    if (!/^09\d{9}$/.test(username)) { showErrors({ username: 'شماره موبایل معتبر نیست' }); return; }
    setBusy(true);
    try {
      const r = await auth.signIn(username);
      localStorage.setItem(LAST_PHONE_KEY, username); // remember phone for next time
      if (r.mode === 'signup') { setStep('signup'); startResendTimer(); }
      else if (r.hasPassword) setStep('password');
      else { setStep('otp'); startResendTimer(); }
    } catch (e) { fail(e); } finally { setBusy(false); }
  };

  const submitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setBusy(true);
    try { await auth.loginByPassword(username, password); done(); }
    catch (e) { fail(e, 'رمز عبور صحیح نیست'); } finally { setBusy(false); }
  };

  const submitOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setBusy(true);
    try {
      if (step === 'signup') await auth.signup(username, code, fullName ? { full_name: fullName } : {});
      else await auth.loginByCode(username, code);
      done();
    } catch (e) { fail(e, 'کد وارد شده صحیح نیست'); } finally { setBusy(false); }
  };

  const switchToCode = async () => {
    setError(null); setBusy(true);
    try { await auth.resendCode(username); setStep('otp'); startResendTimer(); }
    catch (e) { fail(e); } finally { setBusy(false); }
  };

  const submitForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setBusy(true);
    try { await auth.requestPasswordReset(username); setStep('reset'); startResendTimer(); }
    catch (e) { fail(e); } finally { setBusy(false); }
  };

  const submitReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); resetErrors();
    if (password !== repeatPassword) { showErrors({ repeatPassword: 'رمز عبور و تکرار آن یکسان نیستند' }); return; }
    setBusy(true);
    try { await auth.resetPassword(username, password, repeatPassword, code); goto('password'); }
    catch (e) { fail(e); } finally { setBusy(false); }
  };

  const handleResend = async () => {
    if (resendIn > 0 || busy) return;
    setError(null);
    try { await auth.resendCode(username); startResendTimer(); } catch (e) { fail(e); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] px-4" dir="rtl">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
        <Link to="/" className="flex items-center justify-center mb-6">
          <img src="/logoghestit.png" alt="قسطیت" className="h-12" />
        </Link>

        {step === 'phone' && (
          <form onSubmit={submitPhone} className="space-y-5">
            <Header title="ورود به قسطیت" subtitle="شماره موبایل خود را وارد کنید" />
            <Field icon={<Phone size={18} />} error={errors.username}>
              <input id="username" value={username} onChange={(e) => { setUsername(e.target.value.replace(/\D/g, '').slice(0, 11)); clearError('username'); }}
                placeholder="09xxxxxxxxx" dir="ltr" inputMode="numeric" autoFocus
                className="w-full bg-transparent text-center tracking-widest text-lg outline-none" />
            </Field>
            <Err msg={error} />
            <Submit busy={busy} label="ادامه" />
          </form>
        )}

        {step === 'password' && (
          <form onSubmit={submitPassword} className="space-y-5">
            <Header icon={<KeyRound size={22} />} title="ورود با رمز عبور" subtitle={`رمز عبور حساب ${username}`} onEdit={() => goto('phone')} />
            <PasswordField id="password" value={password} error={errors.password} placeholder="رمز عبور" autoFocus
              onChange={(v) => { setPassword(v); clearError('password'); }} />
            <Err msg={error} />
            <Submit busy={busy} label="ورود" />
            <div className="flex items-center justify-between text-sm">
              <button type="button" onClick={switchToCode} className="text-primary font-bold">ورود با کد پیامک</button>
              <button type="button" onClick={() => goto('forgot')} className="text-slate-500">فراموشی رمز؟</button>
            </div>
          </form>
        )}

        {(step === 'otp' || step === 'signup') && (
          <form onSubmit={submitOtp} className="space-y-5">
            <Header
              icon={step === 'signup' ? <ShieldCheck size={22} /> : <MessageSquare size={22} />}
              title={step === 'signup' ? 'ساخت حساب جدید' : 'تأیید شماره موبایل'}
              subtitle={`کد ارسال‌شده به ${username} را وارد کنید`}
              onEdit={() => goto('phone')}
            />
            {step === 'signup' && (
              <Field error={errors.full_name}>
                <input id="full_name" value={fullName} onChange={(e) => { setFullName(e.target.value); clearError('full_name'); }} placeholder="نام و نام خانوادگی"
                  className="w-full bg-transparent text-center outline-none" />
              </Field>
            )}
            <CodeField value={code} onChange={(v) => { setCode(v); clearError('code'); }} error={errors.code} />
            <Err msg={error} />
            <Submit busy={busy} label={step === 'signup' ? 'ثبت‌نام و ورود' : 'ورود'} />
            <ResendButton resendIn={resendIn} onClick={handleResend} />
          </form>
        )}

        {step === 'forgot' && (
          <form onSubmit={submitForgot} className="space-y-5">
            <Header title="بازیابی رمز عبور" subtitle="کد بازیابی به موبایل شما ارسال می‌شود" onEdit={() => goto('password')} />
            <Field icon={<Phone size={18} />} error={errors.username}>
              <input id="username" value={username} onChange={(e) => { setUsername(e.target.value.replace(/\D/g, '').slice(0, 11)); clearError('username'); }}
                placeholder="09xxxxxxxxx" dir="ltr" inputMode="numeric"
                className="w-full bg-transparent text-center tracking-widest text-lg outline-none" />
            </Field>
            <Err msg={error} />
            <Submit busy={busy} label="ارسال کد بازیابی" />
          </form>
        )}

        {step === 'reset' && (
          <form onSubmit={submitReset} className="space-y-5">
            <Header icon={<KeyRound size={22} />} title="رمز عبور جدید" subtitle={`کد ارسال‌شده به ${username} و رمز جدید را وارد کنید`} />
            <CodeField value={code} onChange={(v) => { setCode(v); clearError('code'); }} error={errors.code} />
            <PasswordField id="password" value={password} error={errors.password} placeholder="رمز عبور جدید"
              onChange={(v) => { setPassword(v); clearError('password'); }} />
            <PasswordField id="repeatPassword" value={repeatPassword} error={errors.repeatPassword} placeholder="تکرار رمز عبور"
              onChange={(v) => { setRepeatPassword(v); clearError('repeatPassword'); }} />
            <Err msg={error} />
            <Submit busy={busy} label="ذخیره رمز جدید" />
            <ResendButton resendIn={resendIn} onClick={handleResend} />
          </form>
        )}

        <div className="text-center mt-6">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-primary">
            <ArrowRight size={16} /> بازگشت به صفحه اصلی
          </Link>
        </div>
      </div>
    </div>
  );
}

function Header({ title, subtitle, icon, onEdit }: { title: string; subtitle?: string; icon?: React.ReactNode; onEdit?: () => void }) {
  return (
    <header className="text-center">
      {icon && <div className="mx-auto mb-3 grid place-items-center w-12 h-12 rounded-full bg-primary/10 text-primary">{icon}</div>}
      <h1 className="text-lg font-black text-slate-900">{title}</h1>
      {subtitle && (
        <p className="text-sm text-slate-500 mt-1">
          <span dir="auto">{subtitle}</span>
          {onEdit && <button type="button" onClick={onEdit} className="text-primary mr-1">ویرایش</button>}
        </p>
      )}
    </header>
  );
}

function Field({ children, icon, error }: { children: React.ReactNode; icon?: React.ReactNode; error?: string }) {
  return (
    <div>
      <div className={`flex items-center gap-2 rounded-2xl px-4 py-3 transition-colors ${
        error ? 'bg-red-50 border-2 border-red-400 focus-within:border-red-500'
              : 'bg-slate-50 border border-slate-200 focus-within:border-primary'}`}>
        {icon && <span className={error ? 'text-red-400' : 'text-slate-400'}>{icon}</span>}
        {children}
      </div>
      <FieldError msg={error} />
    </div>
  );
}

function PasswordField({ id, value, onChange, error, placeholder, autoFocus }: {
  id: string; value: string; onChange: (v: string) => void; error?: string; placeholder: string; autoFocus?: boolean;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <Field icon={<KeyRound size={18} />} error={error}>
      <input id={id} type={visible ? 'text' : 'password'} value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} autoFocus={autoFocus} className="w-full bg-transparent outline-none" />
      <button type="button" onClick={() => setVisible((v) => !v)} tabIndex={-1}
        aria-label={visible ? 'پنهان کردن رمز عبور' : 'نمایش رمز عبور'}
        className="text-slate-400 hover:text-slate-600 transition-colors">
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </Field>
  );
}

function CodeField({ value, onChange, error }: { value: string; onChange: (v: string) => void; error?: string }) {
  return (
    <Field error={error}>
      <input id="code" value={value} onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
        placeholder="_ _ _ _ _ _" dir="ltr" inputMode="numeric" autoFocus
        className="w-full bg-transparent text-center tracking-[0.5em] text-xl outline-none" />
    </Field>
  );
}

function Err({ msg }: { msg: string | null }) {
  if (!msg) return null;
  return <p className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2 text-center">{msg}</p>;
}

function Submit({ busy, label }: { busy: boolean; label: string }) {
  return (
    <button type="submit" disabled={busy}
      className="w-full bg-primary hover:bg-primary-hover text-white font-bold rounded-2xl py-3 transition-colors disabled:opacity-60">
      {busy ? 'لطفاً صبر کنید…' : label}
    </button>
  );
}

function ResendButton({ resendIn, onClick }: { resendIn: number; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} disabled={resendIn > 0} className="w-full text-sm text-slate-500 disabled:opacity-50">
      {resendIn > 0 ? `ارسال مجدد کد تا ${resendIn} ثانیه` : 'ارسال مجدد کد'}
    </button>
  );
}
