import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ArrowRight, CreditCard, Eye, EyeOff, KeyRound, MessageSquare, Phone, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { ApiError } from '../../lib/api';
import { useFieldErrors, FieldError } from '../app/shared';
import { setPageSeo } from '../../lib/seo';

type Step = 'phone' | 'password' | 'otp' | 'signup' | 'kyc' | 'forgot' | 'reset';

const RESEND_SECONDS = 90;
// SMS one-time code length (MgSignIn generates a 4-digit code).
const OTP_LENGTH = 4;
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
  // Signup requires KYC identity data; first/last name are resolved server-side
  // from the national id, so only the id + Jalali birthdate are collected here.
  const [nationalId, setNationalId] = useState('');
  const [birthDate, setBirthDate] = useState(''); // Jalali YYYY/MM/DD
  const [verifyToken, setVerifyToken] = useState(''); // proof-of-OTP for the KYC step
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const { errors, clearError, reset: resetErrors, showErrors, showApiErrors } =
    useFieldErrors(['username', 'national_id', 'birthDate', 'code', 'password', 'repeatPassword']);

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
  useEffect(() => { setPageSeo({ title: 'ورود و ثبت‌نام | قسطیت', noindex: true }); }, []);

  const fail = (e: unknown, fallback = 'خطایی رخ داد') => {
    // Highlight offending fields AND always surface a banner: field errors can
    // land on inputs not rendered in the current step (e.g. a `username` error
    // on the OTP form), which would otherwise show nothing at all.
    showApiErrors(e);
    if (e instanceof ApiError) setError(e.message || fallback);
    else setError(fallback);
  };
  const goto = (s: Step) => {
    setError(null); resetErrors(); setCode(''); setPassword('');
    setNationalId(''); setBirthDate(''); setVerifyToken('');
    setStep(s);
  };
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

  // OTP step. For login: log in. For signup: verify the code, then advance to
  // the KYC step carrying the returned proof-of-verification token.
  const submitOtp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (busy) return;
    setError(null); setBusy(true);
    try {
      if (step === 'signup') {
        const token = await auth.verifySignupCode(username, code);
        setVerifyToken(token);
        resetErrors(); setNationalId(''); setBirthDate('');
        setStep('kyc');
      } else {
        await auth.loginByCode(username, code);
        done();
      }
    } catch (e) { fail(e, 'کد وارد شده صحیح نیست'); } finally { setBusy(false); }
  };

  // KYC step: national id + Jalali birthdate. Server resolves the name and
  // creates the account using the OTP proof token from the previous step.
  const submitKyc = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (busy) return;
    const errs: Record<string, string> = {};
    if (!/^\d{10}$/.test(nationalId)) errs.national_id = 'کد ملی ۱۰ رقمی معتبر وارد کنید';
    if (!/^\d{4}\/\d{2}\/\d{2}$/.test(birthDate)) errs.birthDate = 'تاریخ تولد را کامل وارد کنید';
    if (Object.keys(errs).length) { setError(null); showErrors(errs); return; }
    setError(null); setBusy(true);
    try {
      await auth.signup(username, verifyToken, { national_id: nationalId, birthDate });
      done();
    } catch (e) { fail(e, 'اطلاعات هویتی تأیید نشد'); } finally { setBusy(false); }
  };

  // Auto-submit the login OTP once all digits are in — the code is 4 digits.
  // Skipped for signup (that step needs the name field too).
  const autoSubmitted = useRef(false);
  useEffect(() => {
    if ((step === 'otp' || step === 'signup') && code.length === OTP_LENGTH && !busy && !autoSubmitted.current) {
      autoSubmitted.current = true;
      submitOtp();
    }
    if (code.length < OTP_LENGTH) autoSubmitted.current = false;
  }, [code, step]); // eslint-disable-line react-hooks/exhaustive-deps

  // SMS autofill: read the one-time code straight from the incoming SMS via the
  // WebOTP API (Android Chrome). No-op where unsupported; the manual field and
  // iOS `autocomplete="one-time-code"` suggestion still work.
  useEffect(() => {
    if (step !== 'otp' && step !== 'signup' && step !== 'reset') return;
    if (!('OTPCredential' in window)) return;
    const ac = new AbortController();
    navigator.credentials
      .get({ otp: { transport: ['sms'] }, signal: ac.signal } as CredentialRequestOptions)
      .then((cred) => {
        const otp = (cred as unknown as { code?: string })?.code;
        if (otp) { setCode(otp.replace(/\D/g, '').slice(0, 6)); clearError('code'); }
      })
      .catch(() => { /* aborted or no SMS — ignore */ });
    return () => ac.abort();
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

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
            <CodeField value={code} onChange={(v) => { setCode(v); clearError('code'); }} error={errors.code} />
            <Err msg={error} />
            <Submit busy={busy} label={step === 'signup' ? 'تأیید و ادامه' : 'ورود'} />
            <ResendButton resendIn={resendIn} onClick={handleResend} />
          </form>
        )}

        {step === 'kyc' && (
          <form onSubmit={submitKyc} className="space-y-5">
            <Header
              icon={<CreditCard size={22} />}
              title="تکمیل ثبت‌نام"
              subtitle="کد ملی و تاریخ تولد خود را وارد کنید"
            />
            <Field icon={<CreditCard size={18} />} error={errors.national_id}>
              <input id="national_id" value={nationalId} dir="ltr" inputMode="numeric"
                onChange={(e) => { setNationalId(e.target.value.replace(/\D/g, '').slice(0, 10)); clearError('national_id'); }}
                placeholder="کد ملی" autoFocus className="w-full bg-transparent text-center tracking-widest outline-none" />
            </Field>
            <JalaliDateField error={errors.birthDate}
              onChange={(v) => { setBirthDate(v); clearError('birthDate'); }} />
            <Err msg={error} />
            <Submit busy={busy} label="ثبت‌نام و ورود" />
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
        placeholder="_ _ _ _" dir="ltr" inputMode="numeric" autoFocus
        autoComplete="one-time-code" name="one-time-code"
        className="w-full bg-transparent text-center tracking-[0.5em] text-xl outline-none" />
    </Field>
  );
}

// Jalali birthdate entered as three numeric boxes (year / month / day). Emits a
// canonical `YYYY/MM/DD` string once all three are filled, otherwise ''. The
// component remounts when the signup step is left, so it needs no reset prop.
function JalaliDateField({ onChange, error }: { onChange: (v: string) => void; error?: string }) {
  const [y, setY] = useState('');
  const [m, setM] = useState('');
  const [d, setD] = useState('');
  const emit = (ny: string, nm: string, nd: string) => {
    onChange(ny.length === 4 && nm && nd ? `${ny}/${nm.padStart(2, '0')}/${nd.padStart(2, '0')}` : '');
  };
  const box = 'w-full bg-transparent text-center outline-none';
  return (
    <div>
      <div id="birthDate" className={`flex items-center gap-1 rounded-2xl px-4 py-3 transition-colors ${
        error ? 'bg-red-50 border-2 border-red-400 focus-within:border-red-500'
              : 'bg-slate-50 border border-slate-200 focus-within:border-primary'}`} dir="ltr">
        <input value={y} inputMode="numeric" placeholder="۱۳۷۰"
          onChange={(e) => { const v = e.target.value.replace(/\D/g, '').slice(0, 4); setY(v); emit(v, m, d); }}
          className={box} aria-label="سال تولد" />
        <span className="text-slate-300">/</span>
        <input value={m} inputMode="numeric" placeholder="۰۵"
          onChange={(e) => { const v = e.target.value.replace(/\D/g, '').slice(0, 2); setM(v); emit(y, v, d); }}
          className={box} aria-label="ماه تولد" />
        <span className="text-slate-300">/</span>
        <input value={d} inputMode="numeric" placeholder="۱۲"
          onChange={(e) => { const v = e.target.value.replace(/\D/g, '').slice(0, 2); setD(v); emit(y, m, v); }}
          className={box} aria-label="روز تولد" />
      </div>
      <p className="mt-1 text-xs text-slate-400">تاریخ تولد شمسی — مثال: ۱۳۷۰/۰۵/۱۲</p>
      <FieldError msg={error} />
    </div>
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
