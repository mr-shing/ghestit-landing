import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { setPageSeo } from '../lib/seo';
import {
  ArrowRight, Download as DownloadIcon, Smartphone, Share, PlusSquare,
  MonitorSmartphone, CheckCircle2, Apple, ShieldCheck, Chrome,
} from 'lucide-react';

// Chrome/Edge fire this before showing the native install prompt; we capture it
// so a custom button can trigger installation on demand.
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

const APK_URL = (import.meta.env.VITE_APK_URL as string | undefined) || '/downloads/ghestit.apk';
const CAFEBAZAAR_URL =
  (import.meta.env.VITE_CAFEBAZAAR_URL as string | undefined) || 'https://cafebazaar.ir/app/com.ghestit.app';

function useInstallPrompt() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setInstalled(standalone);

    const onPrompt = (e: Event) => { e.preventDefault(); setPrompt(e as BeforeInstallPromptEvent); };
    const onInstalled = () => { setInstalled(true); setPrompt(null); };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const install = async () => {
    if (!prompt) return;
    await prompt.prompt();
    await prompt.userChoice;
    setPrompt(null);
  };

  return { canInstall: !!prompt, install, installed };
}

const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent);

export default function Download() {
  const { canInstall, install, installed } = useInstallPrompt();
  const ios = typeof navigator !== 'undefined' && isIOS();

  useEffect(() => {
    setPageSeo({
      title: 'دانلود اپلیکیشن قسطیت | نصب برنامه مدیریت و پرداخت اقساط',
      description: 'دانلود و نصب اپلیکیشن قسطیت برای اندروید و iOS؛ مدیریت اقساط، پرداخت آنلاین اقساط و اعتبارسنجی در گوشی شما.',
      path: '/download',
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fafafa] to-emerald-50/40" dir="rtl">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-primary mb-6">
          <ArrowRight size={16} /> بازگشت به صفحه اصلی
        </Link>

        {/* Hero */}
        <motion.header
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="text-center mb-10"
        >
          <motion.img
            src="/icons/icon-192.png" alt="قسطیت"
            initial={{ scale: 0.8, rotate: -6 }} animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            className="w-24 h-24 rounded-[1.75rem] shadow-xl shadow-emerald-200/60 ring-1 ring-slate-100 mx-auto mb-5"
          />
          <h1 className="text-3xl font-black text-slate-900">نصب اپلیکیشن قسطیت</h1>
          <p className="text-sm text-slate-500 mt-2 leading-7">
            قسطیت را روی گوشی یا رایانه خود نصب کنید و بدون مرورگر، سریع‌تر به پنل اقساط دسترسی داشته باشید.
          </p>
        </motion.header>

        {installed ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl border border-emerald-100 shadow-sm p-8 text-center"
          >
            <CheckCircle2 className="w-14 h-14 text-primary mx-auto mb-3" />
            <h2 className="text-xl font-black text-slate-800">قسطیت روی این دستگاه نصب شده است</h2>
            <p className="text-sm text-slate-500 mt-2">می‌توانید از آیکون برنامه در صفحه اصلی دستگاه استفاده کنید.</p>
            <Link to="/app" className="inline-block mt-5 bg-primary hover:bg-primary-hover text-white font-bold rounded-2xl px-6 py-3 transition-colors">
              ورود به پنل
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-5">
            {/* Primary: install PWA (Android/desktop) */}
            <Card icon={<Smartphone className="w-6 h-6" />} title="نصب مستقیم (PWA)" tone="primary"
              desc="سبک، بدون نیاز به فروشگاه؛ روی اندروید و رایانه با یک کلیک نصب می‌شود.">
              {ios ? (
                <IosSteps />
              ) : canInstall ? (
                <button onClick={install}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold rounded-2xl px-6 py-3 transition-colors">
                  <DownloadIcon size={18} /> نصب برنامه روی دستگاه
                </button>
              ) : (
                <p className="text-sm text-slate-500 leading-7">
                  برای نصب، این صفحه را در مرورگر <b>Chrome</b> باز کنید و از منوی مرورگر گزینه
                  «نصب برنامه» / «Add to Home screen» را بزنید.
                </p>
              )}
            </Card>

            {/* Android APK / Cafebazaar */}
            <Card icon={<DownloadIcon className="w-6 h-6" />} title="نصب اندروید (APK / کافه‌بازار)"
              desc="فایل نصبی مستقیم اندروید یا دریافت از کافه‌بازار.">
              <div className="flex flex-wrap gap-3">
                <a href={CAFEBAZAAR_URL} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#facc15] hover:brightness-95 text-slate-900 font-bold rounded-2xl px-5 py-3 transition">
                  <ShieldCheck size={18} /> دریافت از کافه‌بازار
                </a>
                <a href={APK_URL} download
                  className="inline-flex items-center gap-2 border border-slate-200 hover:border-primary text-slate-700 font-bold rounded-2xl px-5 py-3 transition-colors">
                  <DownloadIcon size={18} /> دانلود مستقیم APK
                </a>
              </div>
              <p className="text-xs text-slate-400 mt-3 leading-6">
                هنگام نصب مستقیم APK، ممکن است اندروید اجازه «نصب از منابع ناشناس» بخواهد؛ آن را تأیید کنید.
              </p>
            </Card>

            {/* iOS */}
            <Card icon={<Apple className="w-6 h-6" />} title="نصب روی iOS (آیفون / آیپد)"
              desc="روی iOS تنها از طریق مرورگر Safari و افزودن به صفحه اصلی امکان‌پذیر است (فایل APK پشتیبانی نمی‌شود).">
              <IosSteps />
            </Card>

            {/* Desktop */}
            <Card icon={<MonitorSmartphone className="w-6 h-6" />} title="نصب روی رایانه"
              desc="در مرورگر Chrome یا Edge، آیکون نصب کنار نوار آدرس را بزنید.">
              <p className="text-sm text-slate-500 leading-7 inline-flex items-center gap-1.5">
                <Chrome size={16} className="text-slate-400" /> نوار آدرس ← آیکون نصب ← «نصب قسطیت»
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

function Card({ icon, title, desc, tone, children }: {
  icon: React.ReactNode; title: string; desc: string; tone?: 'primary'; children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
      className={`bg-white rounded-3xl border shadow-sm p-6 ${tone === 'primary' ? 'border-primary/30 ring-1 ring-primary/10' : 'border-slate-100'}`}
    >
      <div className="flex items-start gap-4">
        <span className={`grid place-items-center w-12 h-12 rounded-2xl shrink-0 ${tone === 'primary' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600'}`}>
          {icon}
        </span>
        <div className="flex-1">
          <h2 className="font-black text-slate-800">{title}</h2>
          <p className="text-sm text-slate-500 mt-1 leading-6">{desc}</p>
          <div className="mt-4">{children}</div>
        </div>
      </div>
    </motion.section>
  );
}

function IosSteps() {
  return (
    <ol className="space-y-2 text-sm text-slate-600">
      <li className="flex items-center gap-2">
        <span className="grid place-items-center w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs font-bold shrink-0">۱</span>
        این صفحه را در مرورگر <b className="mx-1">Safari</b> باز کنید.
      </li>
      <li className="flex items-center gap-2">
        <span className="grid place-items-center w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs font-bold shrink-0">۲</span>
        دکمه <Share size={15} className="inline mx-1 text-sky-500" /> (اشتراک‌گذاری) را بزنید.
      </li>
      <li className="flex items-center gap-2">
        <span className="grid place-items-center w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs font-bold shrink-0">۳</span>
        گزینه <PlusSquare size={15} className="inline mx-1 text-slate-500" /> «Add to Home Screen» را انتخاب کنید.
      </li>
    </ol>
  );
}
