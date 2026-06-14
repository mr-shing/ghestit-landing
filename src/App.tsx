import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Layers, 
  CheckCircle2, 
  MessageSquare, 
  FileText, 
  UserCheck, 
  ShieldCheck, 
  TrendingUp, 
  PhoneCall, 
  ChevronDown, 
  Bookmark, 
  HelpCircle, 
  Coins, 
  Star,
  Users2,
  Lock,
  ExternalLink,
  Menu,
  X,
  MapPin,
  Mail,
  Zap,
  Check,
  Building,
  Sparkles,
  ShoppingBag,
  Stethoscope,
  Briefcase,
  ArrowLeft,
  CreditCard,
  Infinity,
  FunnelPlus,
  ListChecks
} from 'lucide-react';

import ThreeCanvas from './components/ThreeCanvas';
import DemoRequestModal from './components/DemoRequestModal';
import DocsSection from './components/DocsSection';
import AboutUs from './components/AboutUs';
import { Plan, FeatureItem } from './types';
import GhestitVisual from './components/GhestitVisual';

export default function App() {
  const [isDemoOpen, setIsDemoOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [selectedPlanDetail, setSelectedPlanDetail] = useState<string | null>(null);
  /* ۱. آپدیت تایپ وضعیت برای پشتیبانی از صفحه جدید */
  const [currentView, setCurrentView] = useState<'home' | 'docs' | 'contact' | 'aboutus'>('home');

  // Flexible view and smooth scroll navigation helper
  const navigateToView = (view: 'home' | 'docs' | 'contact' | 'aboutus', anchorId?: string) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' as any });
    
    if (anchorId) {
      setTimeout(() => {
        const element = document.getElementById(anchorId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  // Pricing Plans as specified by user
  const plans: Plan[] = [
    {
      id: 'basic',
      name: 'پایه',
      price: '۱۲ میلیون تومان',
      originalPriceNum: 12000000,
      period: 'در سال',
      link: 'https://panel.ghestit.com/company/create?type=2',
      features: [
        { text: 'محاسبه خودکار اقساط', included: true },
        { text: 'محاسبه خودکار جریمه دیرکرد', included: true },
        { text: 'پیامک یادآور اقساط', included: true },
        { text: 'چاپ قرارداد اختصاصی', included: true },
        { text: 'اعتبار سنجی کاربران', included: false },
        { text: 'ساخت اقساط نامنظم', included: false },
        { text:  'ساخت اقساط بدون چک', included: false },
        { text:  'درگاه پرداخت اختصاصی', included: false },
      ],
      smsCountText: '۱۰۰۰ عدد پیامک رایگان *',
      buttonText: 'انتخاب طرح پایه'
    },
    {
      id: 'plus',
      name: 'پلاس',
      price: '۱۸ میلیون تومان',
      originalPriceNum: 18000000,
      period: 'در سال',
      link: 'https://panel.ghestit.com/company/create?type=3',
      features: [
        { text: 'محاسبه خودکار اقساط', included: true },
        { text: 'محاسبه خودکار جریمه دیرکرد', included: true },
        { text: 'پیامک یادآور اقساط', included: true },
        { text: 'چاپ قرارداد اختصاصی', included: true },
        { text: 'اعتبار سنجی کاربران', included: true },
        { text: 'ساخت اقساط نامنظم', included: true },
        { text:  'ساخت اقساط بدون چک', included: false },
        { text:  'درگاه پرداخت اختصاصی', included: false },
      ],
      smsCountText: '۱۰۰۰ عدد پیامک رایگان *',
      buttonText: 'انتخاب طرح پلاس'
    },
    {
      id: 'pro',
      name: 'پرو',
      price: '۲۸ میلیون تومان',
      originalPriceNum: 28000000,
      period: 'در سال',
      isPopular: true,
      link: 'https://panel.ghestit.com/company/create?type=3',
      features: [
        { text: 'محاسبه خودکار اقساط', included: true },
        { text: 'محاسبه خودکار جریمه دیرکرد', included: true },
        { text: 'پیامک یادآور اقساط', included: true },
        { text: 'چاپ قرارداد اختصاصی', included: true },
        { text: 'اعتبار سنجی کاربران', included: true },
        { text: 'ساخت اقساط نامنظم', included: true },
        { text:  'ساخت اقساط بدون چک', included: true },
        { text:  'درگاه پرداخت اختصاصی', included: false },
      ],
      smsCountText: '۲۰۰۰ عدد پیامک رایگان *',
      buttonText: 'انتخاب طرح پرو (نسخه محبوب)'
    },
    {
      id: 'enterprise',
      name: 'اختصاصی',
      price: 'تماس بگیرید',
      originalPriceNum: 0,
      period: 'شرایط توافقی',
      features: [
        { text: 'محاسبه خودکار اقساط', included: true },
        { text: 'محاسبه خودکار جریمه دیرکرد', included: true },
        { text: 'پیامک یادآور اقساط', included: true },
        { text: 'چاپ قرارداد اختصاصی', included: true },
        { text: 'اعتبار سنجی کاربران', included: true },
        { text: 'ساخت اقساط نامنظم', included: true },
        { text:  'ساخت اقساط بدون چک', included: true },
        { text:  'درگاه پرداخت اختصاصی', included: true },
      ],
      smsCountText: 'پیامک نامحدود رایگان *',
      buttonText: 'تماس با ما'
    }
  ];

  // Why GhestIt Features block
  const features: FeatureItem[] = [
    {
      id: 'f1',
      title: 'ایجاد فروش اقساطی',
      description: 'ایجاد اقساط به دلخواه',
      iconName: 'Layers'
    },
    {
      id: 'f2',
      title: 'محاسبه اتوماتیک کارمزد و دیرکرد',
      description: 'خودکار کردن فرآیندها به صورت هوشمند و دقیق',
      iconName: 'TrendingUp'
    },
    {
      id: 'f3',
      title: 'ارسال پیامک یادآوری',
      description: 'پیامکهای یادآوری هوشمند برای مشتریان پیش از سررسید',
      iconName: 'MessageSquare'
    },
    {
      id: 'f4',
      title: 'پرداخت اقساط با درگاه بانکی',
      description: 'پرداخت سریع به وسیله درگاه اختصاصی و آنی شتاب',
      iconName: 'CreditCard'
    },
    {
      id: 'f5',
      title: 'اعتبار سنجی بانکی',
      description: 'اعتبارسنجی سریع، هوشمند و آسان مشتریان و خریداران',
      iconName: 'UserCheck'
    },
    {
      id: 'f6',
      title: 'کوتاه‌ترین زمان تسویه',
      description: 'تسویه قسط در کوتاه ترین زمان ممکن به حساب متصل پذیرنده',
      iconName: 'ShieldCheck'
    }
  ];

  // Active category mapping to show target audience interactivity
  const [activeCategory, setActiveCategory] = useState<string>('stores');
  const targetAudienceData = {
    stores: {
      title: 'فروشگاه‌های کالا و تجهیزات ',
      description: 'با برنامه قسطیت، فروشگاه شما مجهز به پیش‌رفته‌ترین درگاه پرداخت اقساط می‌شود. مشتری از هر جای کشور کالا را انتخاب کرده، اعتبارسنجی را پشت سر می‌گذارد و خرید اقساطی خود را ثبت می‌کند.',
      benefits: [' اقساط آنلاین', 'محاسبه کارمزد کالا بدون مسدودی حساب', 'حذف فیزیکی چک و فرآیند پرونده‌های کاغذی'],
      icon: ShoppingBag
    },
    clinics: {
      title: 'کلینیک‌های درمانی، دندانپزشکی و خدمات زیبایی',
      description: 'خدمات پزشکی و درمانی معمولاً هزینه‌های بالایی دارند. قسطیت این امکان را به مراجعین شما می‌دهد تا در کوتاه‌ترین زمان ممکن هزینه‌ها را قسط‌بندی کرده و با قراردادهای الکترونیک متعهد شوند.',
      benefits: ['ساخت اقساط نامنظم خدمات درمانی', 'ثبت سفته الکترونیک ضامن', 'درگاه پرداخت مستقیم موبایلی'],
      icon: Stethoscope
    },
    wholesalers: {
      title: 'توزیع‌کنندگان عمده، بنکداران و زنجیره تامین',
      description: 'قسطیت شرایط مناسبی را ایجاد کرده تا بنکداران و توزیع‌کنندگان عمده بتوانند کالاهای خود را بدون ریسک خواب سرمایه و از طریق اعتبار سنجی زنجیره‌ای بین خرده‌فروشان توزیع نمایند.',
      benefits: ['مدیریت تسویه خودکار زنجیره‌ی فروشگاهی', 'سامانه پیامکی متمرکز پیگیری معوقات', 'پنل حسابداری ادغام‌شده شرکتی'],
      icon: Building
    },
    services: {
      title: 'شرکت‌های خدماتی، دیجیتال مارکتینگ و آموزشگاه‌ها',
      description: 'دوره‌های آموزشی گران‌قیمت یا خدمات نرم‌افزاری بلندمدت را از این پس با شرایط قسطی ارائه دهید. فرآیند کسر قسط خودکار در پنل قسطیت دغدغه وصول درآمد شما را کاملاً ریشه‌کن می‌کند.',
      benefits: ['محاسبه اتوماتیک کارمزد دوره‌ها', 'تسویه با درگاه شخصی پذیرنده', 'کاهش نرخ لغو قرارداد خدمات'],
      icon: Briefcase
    }
  };

  const handlePlanSelection = (plan: Plan) => {
    setSelectedPlanDetail(plan.name);
    setIsDemoOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#d1cfcf]/40 flex flex-col font-sans selection:bg-[#02A958] selection:text-white relative z-10" dir="rtl" id="home">
      
      {/* Persistent 3D installment simulator background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <ThreeCanvas isBackground={true} />
      </div>
      
      {/* 1. HEADER / NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-[#fafafa]/90 backdrop-blur-md border-b border-slate-100 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Brand Logo & Name */}
          <a href="/" className="flex items-center gap-3 transition-opacity hover:opacity-90">
            <img 
              src="/logoghestit.png" 
              className="w-13 h-13" 
              alt="Logo" 
            />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <button 
              onClick={() => navigateToView('home')} 
              className={`text-sm font-extrabold font-sans cursor-pointer transition-colors ${currentView === 'home' ? 'text-primary' : 'text-slate-600 hover:text-primary'}`}
            >
              خانه
            </button>
            <button 
              onClick={() => navigateToView('home', 'why-ghestit')} 
              className="text-slate-600 hover:text-primary transition-colors text-sm font-bold font-sans cursor-pointer"
            >
              چرا قسطیت؟
            </button>
            <button 
              onClick={() => navigateToView('home', 'pricing-section')} 
              className="text-slate-600 hover:text-primary transition-colors text-sm font-bold font-sans cursor-pointer"
            >
              لیست قیمت
            </button>
            <button 
              onClick={() => navigateToView('docs')} 
              className={`text-sm font-extrabold font-sans cursor-pointer transition-colors ${currentView === 'docs' ? 'text-primary' : 'text-slate-600 hover:text-primary'}`}
            >
              مستندات آموزشی
            </button>
            <button 
              onClick={() => navigateToView('aboutus')} 
              className={`text-sm font-extrabold font-sans cursor-pointer transition-colors ${currentView === 'aboutus' ? 'text-primary' : 'text-slate-600 hover:text-primary'}`}
            >
              درباره ما
            </button>
            <button 
              onClick={() => navigateToView('contact')} 
              className={`text-sm font-extrabold font-sans cursor-pointer transition-colors ${currentView === 'contact' ? 'text-primary' : 'text-slate-600 hover:text-primary'}`}
            >
              تماس با ما
            </button>
          </nav>

          {/* Action Call to Button */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://panel.ghestit.com/company/create?type=1"
              target="_blank"                 
              rel="noopener noreferrer"       
              className="px-6 py-3.5 bg-[#02A958] hover:bg-primary-hover text-white text-xs font-black rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center gap-2 cursor-pointer no-underline inline-flex"
            >
               درخواست نسخه دمو 
            </a>
          </div>

          {/* Mobile hamburger menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-950 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile menu expanded state */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#fafafa] border-t border-slate-100 overflow-hidden px-4 py-4 space-y-3 shadow-lg text-right"
            >
              <button onClick={() => navigateToView('home')} className={`block w-full text-right py-2 text-xs font-bold ${currentView === 'home' ? 'text-primary' : 'text-slate-700'}`}>خانه</button>
              <button onClick={() => navigateToView('home', 'why-ghestit')} className="block w-full text-right py-2 text-xs font-bold text-slate-700">چرا قسطیت؟</button>
              <button onClick={() => navigateToView('home', 'pricing-section')} className="block w-full text-right py-2 text-xs font-bold text-slate-700">لیست قیمت</button>
              <button onClick={() => navigateToView('docs')} className={`block w-full text-right py-2 text-xs font-bold ${currentView === 'docs' ? 'text-primary' : 'text-slate-700'}`}>مستندات آموزشی</button>
              <button onClick={() => navigateToView('aboutus')} className={`block w-full text-right py-2 text-xs font-bold ${currentView === 'aboutus' ? 'text-primary' : 'text-slate-700'}`}>درباره ما</button>
              <button onClick={() => navigateToView('contact')} className={`block w-full text-right py-2 text-xs font-bold ${currentView === 'contact' ? 'text-primary' : 'text-slate-700'}`}>تماس با ما</button>
              <div className="pt-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsDemoOpen(true);
                  }}
                  className="w-full bg-[#02A958] hover:bg-primary-hover text-white text-xs font-bold py-2.5 rounded-xl"
                >
                  درخواست دمو آنلاین
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ۲. مدیریت رندرینگ صفحات با ساختار شرطی تمیز */}
      {currentView === 'home' ? (
        <>
          {/* 2. HERO SECTION WITH THREEJS BACKGROUND */}
          <section className="relative overflow-hidden pt-16 pb-20 md:py-32 border-b border-slate-100/60 bg-gradient-to-b from-white via-slate-50/30 to-white">
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-50/40 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                
                <div className="lg:col-span-7 space-y-8 text-right flex flex-col items-start order-2 lg:order-1">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50/80 text-[#02A958] border border-emerald-100 rounded-full text-xs font-black backdrop-blur-sm shadow-sm animate-pulse">
                    <Zap className="w-3.5 h-3.5 fill-[#02A958]" />
                    <span>اولین سامانه یکپارچه پرداخت اقساط کشور</span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black text-slate-900 leading-[1.3] tracking-tight">
                    قسطیت؛ نرم افزار هوشمند <br />
                    <span className="text-[#02A958] relative inline-block mt-2">
                      مدیریت اقساط
                      <span className="absolute bottom-2 left-0 w-full h-2 bg-emerald-100 -z-10 rounded-sm" />
                    </span> 
                  </h1>

                  <p className="text-slate-600 text-l l:text-base font-bold leading-relaxed max-w-2xl font-sans text-justify">
                    نرم افزار هوشمند مدیریت اقساط قسطیت راهکاری نوآورانه برای ارائه خدمات و کالاهای اقساطی با شرایط دلخواه و ساده برای کسب‌وکارها است. بدون واسطه و بدون درگیری با چک و حساب‌های دفتری، به آسانی به مشتریانتان اعتبار دهید
                  </p>

                  <div className="flex flex-wrap gap-4 pt-2 w-full sm:w-auto">
                    <a
                      href="https://panel.ghestit.com/company/create?type=1"
                      target="_blank"                 
                      rel="noopener noreferrer"       
                      className="group px-8 py-4 bg-[#02A958] hover:bg-[#02944e] text-white text-sm font-bold rounded-2xl shadow-xl shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-0.5 active:scale-95 flex items-center gap-3 cursor-pointer no-underline w-full sm:w-auto justify-center"
                    >
                      <span>درخواست نسخه دمو</span>
                      <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    </a>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-10 border-t border-slate-100 w-full max-w-2xl" dir="rtl">
                    <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl shadow-sm transition-all hover:shadow-md">
                      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                        <Infinity className="w-10 h-10" strokeWidth={3} />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[16px] lx:text-2xl font-black text-slate-800 block">تعداد اقساط نامحدود</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl shadow-sm transition-all hover:shadow-md">
                      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-50 text-[#02A958] shrink-0">
                        <FunnelPlus className="w-10 h-10" strokeWidth={3} />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[16px] lx:text-2xl font-black text-[#02A958] block">ساخت اقساط با توجه به نوع کسب و کار</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl shadow-sm transition-all hover:shadow-md">
                      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-amber-50 text-amber-600 shrink-0">
                       <ListChecks className="w-10 h-10" strokeWidth={3} />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[16px] lx:text-2xl font-black text-slate-800 block">اقساط بدون چک و آنلاین</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 order-1 lg:order-2 w-full flex justify-center items-center">
                  <div className="w-full max-w-[450px] bg-[#02A958] lg:max-w-full aspect-square relative bg-gradient-to-tr from-emerald-50/10 to-transparent rounded-full p-4">
                    <GhestitVisual />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3. WHY GHESTIT */}
          <div className="relative z-10 w-full py-10 flex flex-col justify-center items-center text-center">
            <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-[#02A958]/25 to-transparent top-1/2 -z-10" />
            <div className="bg-white/95 border border-[#02A958]/20 backdrop-blur-md px-6 py-3 rounded-2xl shadow-lg flex items-center gap-3 active:scale-95 transition-all">
              <Sparkles className="w-5 h-5 text-primary animate-pulse" />
              <h2 className="text-sm md:text-xl lg:text-2xl font-black text-slate-900 tracking-tight" id="features-main-heading">
               چرا قسطیت ؟
              </h2>
            </div>
          </div>

          <section className="py-16 bg-[#fafafa]/60 backdrop-blur-md relative overflow-hidden" id="why-ghestit">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 font-sans">
                  چرا کسب‌وکارها قسطیت را انتخاب کرده‌اند؟
                </h2>
                <p className="text-slate-500 text-[18px] font-bold mt-3 whitespace-nowrap">
                  با هوشمندسازی پرداخت اقساط، زنجیره فرآیندهای مالی خود را از محاسبات کارمزد تا اعتبارسنجی و وصول اقساط را ساده کنید.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feat) => (
                  <div 
                    key={feat.id}
                    className="p-6 rounded-2xl bg-white border border-slate-100 hover:border-primary/20 shadow-sm hover:shadow-md transition-all duration-300 relative group overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-2.5 h-full bg-primary/20 group-hover:bg-primary transition-all duration-300" />
                    
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                      {feat.id === 'f1' && <Layers className="w-5 h-5" />}
                      {feat.id === 'f2' && <TrendingUp className="w-5 h-5" />}
                      {feat.id === 'f3' && <MessageSquare className="w-5 h-5" />}
                      {feat.id === 'f4' && <Coins className="w-5 h-5" />}
                      {feat.id === 'f5' && <UserCheck className="w-5 h-5" />}
                      {feat.id === 'f6' && <ShieldCheck className="w-5 h-5" />}
                    </div>

                    <h3 className="text-sm font-extrabold text-slate-800 mb-2 font-sans group-hover:text-primary transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-[16px] font-bold text-slate-500 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 4. PRICING PLANS */}
          <div className="relative z-10 w-full py-10 flex flex-col justify-center items-center text-center">
            <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-[#02A958]/25 to-transparent top-1/2 -z-10" />
            <div className="bg-white/95 border border-[#02A958]/15 backdrop-blur-md px-6 py-3 rounded-2xl shadow-lg flex items-center gap-3 active:scale-95 transition-all">
              <Coins className="w-5 h-5 text-primary" />
              <h2 className="text-sm md:text-xl lg:text-2xl font-black text-slate-900 tracking-tight" id="pricing-plans-heading">
                پلن‌های عضویت نرم افزار قسطیت
              </h2>
            </div>
          </div>

          <section className="py-16 bg-white/40 backdrop-blur-md relative overflow-hidden" id="pricing-section">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <h2 className="text-2xl md:text-3xl font-black text-slate-900">
                  طرح‌ها و تعرفه‌های نرم‌افزار مدیریت هوشمند اقساط قسطیت
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
                {plans.map((plan, index) => {
                  const isEnterprise = plan.id === 'enterprise';

                  return (
                    <motion.div 
                      key={plan.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ 
                        type: "linear",
                        duration: 0.4, 
                        delay: index * 0.08 
                      }}
                      whileHover={{ 
                        y: -10, 
                        scale: plan.isPopular ? 1.04 : 1.02, 
                        boxShadow: "0 25px 50px -12px rgba(2, 169, 88, 0.25)",
                        borderColor: "#02A958",
                        transition: { 
                          type: "spring", 
                          stiffness: 300, 
                          damping: 22 
                        }
                      }}
                      /* رفع تداخل پرش: کلاس تداخلی scale-108 کاملاً حذف شد */
                      className={`rounded-3xl p-5 border flex flex-col justify-between relative ${
                        plan.isPopular 
                          ? 'border-primary bg-primary/5 shadow-md scale-108' 
                          : 'border-slate-150 bg-white/80 backdrop-blur-md shadow-sm'
                      }`}
                    >
                      {plan.isPopular && (
                        <span className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-[#02A958] text-white text-[14px] font-black px-3.5 py-1 rounded-full uppercase tracking-widest flex items-center gap-1 shadow-sm z-10">
                          <Star className="w-4 h-4 fill-white" />نسخه محبوب
                        </span>
                      )}

                      <div>
                        <div className="border-b border-slate-100 pb-3 mb-4">
                          <h3 className="text-base font-black text-slate-800 block text-right">
                            <span className="text-[#02A958]">{plan.name}</span>
                          </h3>      
                          
                          <div className="flex justify-between items-baseline mt-4 text-right">
                            <div>
                              {isEnterprise ? (
                                <span className="text-lg md:text-xl font-extrabold text-slate-800 font-sans flex items-center gap-1.5 whitespace-nowrap min-h-[58px]">
                                  شرایط توافقی
                                </span>
                              ) : (
                                <>
                                  <span className="text-lg md:text-xl font-extrabold text-slate-800 font-sans flex items-center gap-1.5 whitespace-nowrap">
                                    {plan.price} 
                                    <span className="text-[12px] text-slate-400 font-bold font-sans">
                                      + مالیات بر ارزش افزوده
                                    </span>
                                  </span>
                                  <span className="text-[16px] text-slate-400 block font-bold font-sans mt-0.5">{plan.period}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="bg-[#02A958]/10 text-primary p-2 rounded-lg text-[13px] font-black text-center mb-4">
                          {plan.smsCountText}
                        </div>

                        <div className="space-y-2 mb-6">
                          {plan.features.map((feat, idx) => (
                            <div key={idx} className={`flex items-start gap-1.5 text-[11px] leading-normal ${
                              feat.included ? 'text-slate-600' : 'text-slate-400'
                            }`}>
                              {feat.included ? (
                                <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                              ) : (
                                <X className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                              )}
                              <span className="text-[14px] text-slate-600 font-bold font-sans">{feat.text}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {isEnterprise ? (
                        <button
                          onClick={() => handlePlanSelection(plan)}
                          className="w-full py-2.5 rounded-xl text-xs font-black cursor-pointer bg-slate-50 hover:bg-[#02A958] hover:text-white text-slate-700 border border-slate-200 transition-colors duration-200"
                        >
                          تماس بگیرید
                        </button>
                      ) : (
                        <a
                          href={plan.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`w-full py-2.5 rounded-xl text-xs font-black cursor-pointer flex items-center justify-center no-underline transition-colors duration-200 ${
                            plan.isPopular
                              ? 'bg-[#02A958] hover:bg-[#02904F] text-white shadow-md'
                              : 'bg-slate-50 hover:bg-[#02904F] hover:text-white text-slate-700 border border-slate-200 hover:border-[#02A958]'
                          }`}
                        >
                          خرید طرح
                        </a>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* 5. TARGET AUDIENCE */}
          <div className="relative z-10 w-full py-10 flex flex-col justify-center items-center text-center">
            <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-[#02A958]/25 to-transparent top-1/2 -z-10" />
            <div className="bg-white/95 border border-[#02A958]/15 backdrop-blur-md px-6 py-3 rounded-2xl shadow-lg flex items-center gap-3 active:scale-95 transition-all">
              <Building2 className="w-5 h-5 text-primary" />
              <h2 className="text-sm md:text-xl lg:text-2xl font-black text-slate-900 tracking-tight" id="business-integration-heading">
                تطابق کامل ساختاری با کسب‌وکار شما
              </h2>
            </div>
          </div>

          <section className="py-16 bg-slate-50/60 backdrop-blur-md relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-10">
                <span className="text-xs font-bold text-primary uppercase block mb-2">تنوع کاربری پهناور</span>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900">
                  برنامه قسطیت مناسب چه کسب و کار هایی است؟
                </h2>
                <p className="text-slate-500 text-xs text-[18px] font-bold mt-3 max-w-2xl mx-auto">
                  با توجه به زیر ساخت کامل و شرایط متنوع ساخت اقساط، این پلتفرم برای تمامی کسب و کار های فروشگاهی و خدماتی مناسب می باشد. همچنین برای توزیع کنندگان عمده نیز مناسب می باشد.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                <div className="lg:col-span-5 flex flex-col justify-center gap-3">
                  {[
                    { id: 'stores', label: 'کسب و کارهای فروشگاهی', desc: 'لوازم خانگی، کامپیوتر و ابزار دیجیتال ، لوازم یدکی و ..', i: ShoppingBag },
                    { id: 'clinics', label: 'کلینیک‌های درمانی و زیبایی', desc: 'پزشکان دندانپزشکی، ارتوپدی و جراحی', i: Stethoscope },
                    { id: 'wholesalers', label: 'توزیع‌کنندگان عمده کالا', desc: 'زنجیره خرید کالا ', i: Building },
                    { id: 'services', label: 'مجموعه های خدماتی و آموزشی', desc: 'دپارتمان‌های آموزش، کارهای تبلیغات', i: Briefcase },
                  ].map((item) => {
                    const IconComp = item.i;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveCategory(item.id)}
                        className={`w-full text-right p-4 rounded-2xl border transition-all duration-300 flex items-center gap-4 cursor-pointer ${
                          activeCategory === item.id
                            ? 'bg-white border-primary shadow-md shadow-primary/5'
                            : 'bg-transparent border-slate-200/60 hover:border-slate-300 hover:bg-slate-100/50'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          activeCategory === item.id ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'
                        }`}>
                          <IconComp className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[16px] font-extrabold text-slate-900 block">{item.label}</span>
                          <span className="text-[13px] text-slate-400 block font-bold mt-0.5">{item.desc}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
                  <div className="space-y-4">
                    <span className="text-[10px] bg-primary/10 text-primary border border-primary/25 px-2.5 py-0.5 rounded-full font-bold inline-block">
                      تطابق کامل ساختاری
                    </span>
                    <h3 className="text-[13px] md:text-lg font-black text-slate-800">
                      {targetAudienceData[activeCategory as keyof typeof targetAudienceData].title}
                    </h3>
                    <p className="text-slate-600 text-[16px] font-bold leading-relaxed font-sans">
                      {targetAudienceData[activeCategory as keyof typeof targetAudienceData].description}
                    </p>

                    <div className="space-y-2 pt-4">
                      <span className="text-xs font-bold text-slate-700 block mb-2">مزایای انحصاری در این صنف:</span>
                      {targetAudienceData[activeCategory as keyof typeof targetAudienceData].benefits.map((b, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[12px] font-bold text-slate-500">
                          <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100 mt-6 flex justify-between items-center">
                    <span className="text-[10px] text-slate-400 font-mono"></span>
                    <a 
                      href="https://panel.ghestit.com/company/create?type=1" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-primary hover:text-primary-hover flex items-center gap-1 cursor-pointer"
                    >
                       تست دمو   ←
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 8. STORY AND MISSION SECTION */}
          <section className="py-16 bg-slate-50/60 backdrop-blur-md relative overflow-hidden mt-20" id="about-us">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                <div className="space-y-4 text-right">
                  <span className="text-xs font-bold text-primary tracking-widest uppercase block mb-1">تولد ایده</span>
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 border-r-4 border-[#02A958] pr-4">
                    داستان قسطیت
                  </h2>
                  <p className="text-slate-600 text-[18px] leading-relaxed font-sans">
                    بسیاری از کسب و کار امروزه به فروش اقساطی روی آورده اند. اما به دلیل نداشتن زیرساخت مناسب این کار را به صورت سنتی و از طریف دریافت دستی چک از مشتریان یا به صورت حساب دفتری انجام می دهند که این روش دارای مشکلاتی از قبیل پیگیری پرداخت، مراجعه به بانک و مدیریت دشوار معوقات است. قسطیت پدید آمد است تا پیوند اعتماد بین فروشگاه و مشتری باشد.     
                  </p>
                </div>

                <div className="space-y-4 text-right">
                  <span className="text-xs font-bold text-primary tracking-widest uppercase block mb-1">تعالی اهداف</span>
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 border-r-4 border-slate-400 pr-4">
                    ماموریت قسطیت
                  </h2>
                  <p className="text-slate-600 text-[18px] leading-relaxed font-sans">
                    ما در قسطیت با ایجاد یک سیستم شفاف و کاربرپسند به دنبال تسهیل فرآیند خرید و فروش اقساطی هستیم. با این زیرساخت، کسبوکارها میتوانند محصولات و خدمات خود را با شرایط مناسب در اختیار مشتریان قرار دهند و در عین حال خریداران نیز از امکان پرداخت آسان و اقساطی بهرهمند شوند. قسطیت به نحوی طراحی شده که فرایند پرداخت اقساط در همین پلتفرم انجام شود و کلیه مراحل خرید و پرداخت از ابتدا تا انتها در محیطی واحد صورت گیرد.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : currentView === 'docs' ? (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="py-12 relative overflow-hidden text-right"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/95 backdrop-blur-md p-4 rounded-3xl border border-slate-100 shadow-sm gap-4">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-extrabold block text-right">سامانه قسطیت</span>
                <div className="flex items-center gap-2 text-xs font-bold justify-start">
                  <button onClick={() => navigateToView('home')} className="text-slate-500 hover:text-primary transition-colors cursor-pointer">خانه</button>
                  <span className="text-slate-300">/</span>
                  <span className="text-slate-800 font-black">مستندات ویدیوی آموزشی </span>
                </div>
              </div>
              <button 
                onClick={() => navigateToView('home')} 
                className="text-xs font-extrabold text-[#02A958] hover:text-primary border border-primary/20 hover:bg-primary/5 px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 self-end sm:self-auto"
              >
                <span>بازگشت به خانه قسطیت</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>

            <DocsSection />
          </div>
        </motion.div>
      ) : currentView === 'aboutus' ? (
        /* ۳. رندر کامپوننت درباره ما به صورت یک صفحه مستقل مجزا */
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="py-12 relative overflow-hidden text-right"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/95 backdrop-blur-md p-4 rounded-3xl border border-slate-100 shadow-sm gap-4">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-extrabold block text-right">شناخت ساختار پلتفرم</span>
                <div className="flex items-center gap-2 text-xs font-bold justify-start">
                  <button onClick={() => navigateToView('home')} className="text-slate-500 hover:text-primary transition-colors cursor-pointer">خانه</button>
                  <span className="text-slate-300">/</span>
                  <span className="text-slate-800 font-black">درباره ما و اهداف</span>
                </div>
              </div>
              <button 
                onClick={() => navigateToView('home')} 
                className="text-xs font-extrabold text-[#02A958] hover:text-primary border border-primary/20 hover:bg-primary/5 px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 self-end sm:self-auto"
              >
                <span>بازگشت به خانه قسطیت</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>

            <AboutUs />
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="py-12 relative overflow-hidden text-right"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/95 backdrop-blur-md p-4 rounded-3xl border border-slate-100 shadow-sm gap-4">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-extrabold block text-right">راه‌اندازی و تعهد الکترونیک</span>
                <div className="flex items-center gap-2 text-xs font-bold justify-start">
                  <button onClick={() => navigateToView('home')} className="text-slate-500 hover:text-primary transition-colors cursor-pointer">خانه</button>
                  <span className="text-slate-300">/</span>
                  <span className="text-slate-800 font-black">تماس با ما و مشاوره </span>
                </div>
              </div>
              <button 
                onClick={() => navigateToView('home')} 
                className="text-xs font-extrabold text-[#02A958] hover:text-primary border border-primary/20 hover:bg-primary/5 px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 self-end sm:self-auto"
              >
                <span>بازگشت به خانه قسطیت</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white/95 backdrop-blur-md p-6 rounded-3xl border border-slate-100 shadow-xl space-y-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-primary rounded-full text-[10px] font-extrabold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>پشتیبانی مرکزی قسطیت</span>
                  </div>
                  
                  <h3 className="text-md md:text-lg font-black text-slate-900 leading-tight">کیمیاگران هوشمند تخت جمشید</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-sans font-medium text-right">
                    پشتیبانی مرکزی قسطیت ، پذیرای کلیه صنف‌ها، فروشگاه‌ها و پذیرندگانی است که مایل به افزایش نرخ فروش با استفاده از پورتال‌های اقساط چندبانکه می‌باشند.
                  </p>

                  <div className="space-y-4 pt-4 text-xs">
                    <div className="flex items-start gap-3 text-slate-700 bg-slate-50/80 p-3 rounded-2xl border border-slate-100/60 leading-relaxed justify-start text-right">
                      <MapPin className="w-5 h-5 text-[#02A958] shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-slate-800 mb-0.5 font-bold font-sans">دفتر پشتیبانی:</strong>
                        <span className='font-sans'>کرمان ، خیابان مطهری ، روبروی کوچه 9</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 text-slate-700 bg-slate-50/80 p-3 rounded-2xl border border-slate-100/60 leading-relaxed justify-start text-right">
                      <Mail className="w-5 h-5 text-[#02A958] shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-slate-800 mb-0.5 font-bold font-sans">رایانامه ارتباطی:</strong>
                        <a href="mailto:support@ghestit.ir" className="font-mono text-primary font-sans hover:underline">
                          support@ghestit.ir
                        </a>                     
                      </div>
                    </div>

                    <div className="flex items-start gap-3 text-slate-700 bg-slate-50/80 p-3 rounded-2xl border border-slate-100/60 leading-relaxed justify-start text-right">
                      <PhoneCall className="w-5 h-5 text-[#02A958] shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-slate-800 mb-0.5 font-bold font-sans">تلفن شبانه‌روزی پذیرندگان:</strong>
                        <a href="tel:02191015161" className="font-mono text-slate-900 font-extrabold text-xs block mt-1 hover:text-primary transition-colors">
                          ۰۲۱-۹۱۰۱۵۱۶۱
                        </a>                      
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 text-white p-6 rounded-3xl border border-white/10 shadow-lg relative">
                  <div className="absolute inset-0 bg-[#02A958]/5 pointer-events-none" />
                  <div className="flex justify-between items-center mb-4">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider font-sans">ساعت کار دفتر مرکزی</span>
                  </div>
                  <span className="text-xs text-slate-300 font-sans block leading-relaxed text-right">
                    سیستم رسید و تیکت آنلاین قسطیت به صورت ۲۴ ساعته در خدمت پذیرندگان فعال است. کارشناسان ما در سریع‌ترین زمان ممکن پاسخگوی سوالات فنی خواهند بود.
                  </span>
                </div>
              </div>

              <div className="lg:col-span-7 bg-white/95 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xl space-y-6">
                <div>
                  <h3 className="text-md sm:text-lg font-black text-slate-900 font-sans">فرم آنلاین درخواست مشاوره و فعال‌سازی پورتال</h3>
                  <p className="text-xs text-slate-400 mt-1 font-sans">پس از ارسال اطلاعات، کارشناسان ما ظرف کمتر از ۲۴ ساعت جهت ایجاد بستر دمو تماس می‌گیرند.</p>
                </div>

                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert('درخواست همکاری و مشاوره صنف شما با موفقیت در هسته قسطیت ثبت گردید. به زودی با شماره همراه وارد شده تماس خواهیم گرفت.');
                  }}
                  className="space-y-4 text-right"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-slate-500 block mb-1.5 font-extrabold text-right">نام رابط / دارنده کسب‌وکار *</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="مثلاً: مهران کریمی"
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-slate-800 font-sans font-medium text-right"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 block mb-1.5 font-extrabold text-right">نام صنف یا فروشگاه *</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="مثلاً: فروشگاه فرش شاهکار"
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-slate-800 font-sans font-medium text-right"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-slate-500 block mb-1.5 font-extrabold text-right">تلفن همراه فعال *</label>
                      <input 
                        type="tel" 
                        required 
                        pattern="09[0-9]{9}"
                        placeholder="مثلاً: ۰۹۱۲۳۴۵۶۷۸۹"
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-left font-mono focus:outline-none focus:border-primary text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 block mb-1.5 font-extrabold text-right">آدرس وب‌سایت (اختیاری)</label>
                      <input 
                        type="url" 
                        placeholder="مثلاً: https://shahkarcarpet.ir"
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-left font-mono focus:outline-none focus:border-primary text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 block mb-1.5 font-extrabold text-right">موضوع مشاوره و نیازهای صنف شما</label>
                    <textarea 
                      rows={4}
                      placeholder="چه خدمتی، نحوه سفته، سود یا کارمزد مد نظرتان است، اینجا برای ما بنویسید..."
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-slate-800 font-sans font-medium text-right"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#02A958] hover:bg-primary-hover text-white text-xs font-black rounded-xl shadow-lg transition-all transform active:scale-95 cursor-pointer text-center"
                  >
                    ارسال فرم مشاوره قسطیت
                  </button>
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 10. REAL FOOTER */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-12 border-t border-slate-800/80 mt-20 relative overflow-hidden" dir="rtl">
      {/* افکت نوری بسیار ملایم در پس‌زمینه فوتر */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#02A958]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* بخش اصلی فوتر: لوگو، منو و نمادها */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10 border-b border-slate-800/60 items-center">
          
          {/* ستون اول (۴ از ۱۲): لوگو و معرفی کوتاه */}
          <div className="lg:col-span-4 space-y-4 flex flex-col items-center lg:items-start text-center lg:text-right">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/5 rounded-2xl border border-white/10 shadow-inner">
                <img 
                  src="/logoghestit.png" 
                  className="w-14 h-14 object-contain" 
                  alt="لوگو قسطیت" 
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-white tracking-wide">قسطیت</h3>
                <p className="text-[11px] font-bold text-slate-400">نرم‌افزار هوشمند مدیریت اقساط</p>
              </div>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed max-w-sm">
              زیرساخت نوآورانه و یکپارچه برای تسهیل خرید و فروش اقساطی کالا و خدمات در محیطی کاملاً امن و شفاف.
            </p>
          </div>

          {/* ستون دوم (۵ از ۱۲): لینک‌های دسترسی سریع */}
          <div className="lg:col-span-5 flex flex-wrap justify-center lg:justify-start gap-x-8 gap-y-4 text-[12px] font-black">
            <button onClick={() => navigateToView('home')} className="text-slate-300 hover:text-[#02A958] transition-colors cursor-pointer py-1">صفحه نخست</button>
            <button onClick={() => navigateToView('home', 'pricing-section')} className="text-slate-300 hover:text-[#02A958] transition-colors cursor-pointer py-1">پلن‌های قیمت‌گذاری</button>
            <button onClick={() => navigateToView('docs')} className="text-slate-300 hover:text-[#02A958] transition-colors cursor-pointer py-1">مستندات آموزشی</button>
            <button onClick={() => navigateToView('aboutus')} className="text-white hover:text-[#02A958] transition-colors cursor-pointer py-1 bg-white/5 px-3 rounded-xl border border-white/5">درباره ما</button>
            {/* <button onClick={() => navigateToView('contact')} className="text-slate-300 hover:text-[#02A958] transition-colors cursor-pointer py-1">دفتر مرکزی</button> */}
          </div>

          {/* ستون سوم (۳ از ۱۲): محل قرارگیری نمادهای اعتماد */}
          <div className="lg:col-span-3 flex justify-center lg:justify-end gap-3">
            {/* نماد اول (اینماد) */}
            <div className="w-20 h-20 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#02A958]/30 rounded-2xl p-2 flex items-center justify-center transition-all duration-300 group cursor-pointer shadow-md">
              <img 
                src="/enamad.png" 
                alt="نماد اعتماد الکترونیکی" 
                className="w-full h-full object-contain filter brightness-90 group-hover:brightness-100 transition-all"
                onError={(e) => {
                  // در صورت عدم وجود عکس، یک باکس با متن جایگزین شیک نمایش داده شود
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) parent.innerHTML = '<span class="text-[9px] text-slate-500 font-bold text-center">اینماد</span>';
                }}
              />
            </div>

            {/* نماد دوم (ساماندهی) */}
            <div className="w-20 h-20 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#02A958]/30 rounded-2xl p-2 flex items-center justify-center transition-all duration-300 group cursor-pointer shadow-md">
              <img 
                src="/samandehi.png" 
                alt="نماد ساماندهی" 
                className="w-full h-full object-contain filter brightness-90 group-hover:brightness-100 transition-all"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) parent.innerHTML = '<span class="text-[9px] text-slate-500 font-bold text-center">ساماندهی</span>';
                }}
              />
            </div>
          </div>

        </div>

        {/* بخش فوتر پایینی: کپی‌رایت و قوانین حقوقی */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] font-bold text-slate-500">
          <div className="flex items-center gap-2 text-center md:text-right">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 inline-block shrink-0" />
            <span>تمامی خدمات برنامه قسطیت تابع قوانین و مقررات جمهوری اسلامی ایران است.</span>
          </div>
          
          <div className="text-center md:text-left text-slate-500 font-medium">
            &copy; با احترام، حق نشر تنها متعلق به  
            <a 
              href="https://kimgroup.ir/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-[#02A958] transition-colors duration-200 mx-1 font-black"
            >
              کیمیاگران هوشمند تخت جمشید
            </a>
            می‌باشد.
          </div>
        </div>

      </div>
    </footer>

      {/* Demo RequestDashboard Interactive Overlay Modal */}
      <DemoRequestModal 
        isOpen={isDemoOpen} 
        onClose={() => setIsDemoOpen(false)} 
      />

    </div>
  );
}