import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Send, 
  Sparkles, 
  LayoutDashboard, 
  Users, 
  Activity, 
  PlusCircle, 
  Printer, 
  CreditCard, 
  Check, 
  AlertCircle,
  MessageSquare,
  ShieldAlert,
  Download
} from 'lucide-react';
import { ContactFormData } from '../types';
import { useFieldErrors, FieldError } from '../pages/app/shared';

interface DemoRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DemoRequestModal({ isOpen, onClose }: DemoRequestModalProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    businessName: '',
    phone: '',
    email: '',
    description: ''
  });

  const [submitted, setSubmitted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'customers' | 'contracts' | 'sms'>('overview');
  const { errors, clearError, showErrors } = useFieldErrors(['name', 'businessName', 'phone']);

  // Simulated live client database
  const [clients, setClients] = useState([
    { id: 1, name: 'امیرحسین رضایی', business: 'لوازم خانگی رضایی', amount: '۱۵,۲۰۰,۰۰۰ تومان', paid: '۳ از ۶ قسط', status: 'خوش‌حساب', rating: 'A+', overdue: 0 },
    { id: 2, name: 'مریم حسینی', business: 'کلینیک دندانپزشکی آریا', amount: '۲۴,۰۰۰,۰۰۰ تومان', paid: '۱ از ۸ قسط', status: 'سررسید گذشته', rating: 'B', overdue: 4 },
    { id: 3, name: 'مهران کریمی', business: 'موبایل تپش', amount: '۸,۵۰۰,۰۰۰ تومان', paid: '۴ از ۴ قسط', status: 'تسویه کامل', rating: 'A', overdue: 0 },
    { id: 4, name: 'سارا سعیدی', business: 'آموزشگاه زبان سفیر', amount: '۱۲,۰۰۰,۰۰۰ تومان', paid: '۰ از ۱۲ قسط', status: 'در انتظار پرداخت', rating: 'C', overdue: 0 },
    { id: 5, name: 'علی قادری', business: 'موتورسیکلت کویر', amount: '۴۵,۰۰۰,۰۰۰ تومان', paid: '۲ از ۱۰ قسط', status: 'معوق بحرانی', rating: 'D', overdue: 18 }
  ]);

  // Selected client for generating a customized contract
  const [selectedClientContract, setSelectedClientContract] = useState(clients[0]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'نام و نام‌خانوادگی را وارد کنید';
    if (!formData.businessName.trim()) errs.businessName = 'نام کسب‌وکار را وارد کنید';
    if (!/^0?9\d{9}$/.test(formData.phone.replace(/\D/g, ''))) errs.phone = 'شماره تماس معتبر نیست';
    if (Object.keys(errs).length) { showErrors(errs); return; }
    setSubmitted(true);
  };

  const dangerCls = (has?: string) =>
    has ? 'border-2 border-red-400 bg-red-50 focus:ring-red-400 focus:border-red-500'
        : 'border border-slate-200 bg-slate-50/50 focus:ring-primary focus:border-primary';

  const handleCreateDemoClient = () => {
    // Add custom business info as client
    const customClient = {
      id: clients.length + 1,
      name: formData.name || 'کاربر دمو آزمایشی',
      business: formData.businessName || 'کسب‌و‌کار تستی شما',
      amount: '۳۰,۰۰۰,۰۰۰ تومان',
      paid: '۰ از ۶ قسط',
      status: 'خوش‌حساب',
      rating: 'A+',
      overdue: 0
    };
    setClients([customClient, ...clients]);
    setSelectedClientContract(customClient);
    setActiveTab('overview');
  };

  const resetForm = () => {
    setSubmitted(false);
    setFormData({ name: '', businessName: '', phone: '', email: '', description: '' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden border border-slate-100 relative my-8"
          >
            
            {/* Close buttons */}
            <button
              onClick={onClose}
              className="absolute top-4 left-4 z-10 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!submitted ? (
              // STEP 1: Interactive Request Fields
              <div className="grid grid-cols-1 md:grid-cols-2">
                
                {/* Visual Banner - Right column */}
                <div className="bg-gradient-to-br from-primary to-emerald-950 p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 pointer-events-none" />
                  
                  <div className="space-y-4">
                    <span className="text-xs bg-white/10 px-3 py-1 rounded-full border border-white/15 font-bold inline-block text-accent">
                      دمو فوری و ۲ دقیقه ای
                    </span>
                    <h3 className="text-2xl md:text-3xl font-black leading-tight">
                      نسخه دمو برنامه قسطیت را با مشخصات کسب‌و‌کارتان بسازید!
                    </h3>
                    <p className="text-m text-slate-200/90 leading-relaxed font-light">
                      دیگر نیاز به پیگیری سنتی، دریافت فیزیکی چک و نوشتن فیش دستی نیست. اطلاعات پایه کسب‌وکار خود را وارد کنید تا بلافاصله پیش‌نمایش پنل اختصاصی مدیریت اقساط خود را دریافت کنید.
                    </p>
                  </div>

                  <div className="space-y-3 mt-8 pt-4 border-t border-white/10 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center font-bold text-accent text-[13px]">۱</span>
                      <span>پیش‌نمایش پنل با داده‌های سفارشی شما</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center font-bold text-accent text-[13px]">۲</span>
                      <span>امکان تست ارسال اس‌ام‌اس و چاپ اتوماتیک قرارداد</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center font-bold text-accent text-[13px]">۳</span>
                      <span>اعتبار سنجی هوشمند کد ملی مشتریان</span>
                    </div>
                  </div>

                  <div className="text-[13px] text-slate-400 mt-6 font-mono leading-none">
                    © توسعه یافته توسط  <a 
              href="https://kimgroup.ir/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-[#02A958] transition-colors duration-200 mx-1 font-black"
            >
              کیمیاگران هوشمند تخت جمشید
            </a>
                  </div>
                </div>

                {/* Form Elements - Left Column */}
                <div className="p-8 flex flex-col justify-center">
                  <h4 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-1.5 border-b border-slate-100 pb-3">
                    <Sparkles className="w-5 h-5 text-primary" />
                    فرم تماس با قسطیت
                  </h4>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">نام و نام‌خانوادگی شما *</label>
                      <input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => { setFormData({ ...formData, name: e.target.value }); clearError('name'); }}
                        aria-invalid={!!errors.name}
                        placeholder="مانند: علی حسینی"
                        className={`w-full text-sm px-4 py-2 rounded-xl focus:outline-none focus:ring-1 text-slate-700 transition-colors ${dangerCls(errors.name)}`}
                      />
                      <FieldError id="name-error" msg={errors.name} />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">نام فروشگاه یا کسب‌و‌کار *</label>
                      <input
                        id="businessName"
                        type="text"
                        value={formData.businessName}
                        onChange={(e) => { setFormData({ ...formData, businessName: e.target.value }); clearError('businessName'); }}
                        aria-invalid={!!errors.businessName}
                        placeholder="مانند: نمایشگاه خودرو تخت جمشید"
                        className={`w-full text-sm px-4 py-2 rounded-xl focus:outline-none focus:ring-1 text-slate-700 transition-colors ${dangerCls(errors.businessName)}`}
                      />
                      <FieldError id="businessName-error" msg={errors.businessName} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-600 block mb-1">شماره تماس (پیامک دمو) *</label>
                        <input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => { setFormData({ ...formData, phone: e.target.value }); clearError('phone'); }}
                          aria-invalid={!!errors.phone}
                          placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                          className={`w-full text-left font-mono text-sm px-4 py-2 rounded-xl focus:outline-none focus:ring-1 text-slate-700 transition-colors ${dangerCls(errors.phone)}`}
                        />
                        <FieldError id="phone-error" msg={errors.phone} />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-600 block mb-1">ایمیل کاری (اختیاری)</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="info@business.com"
                          className="w-full text-left font-mono text-sm px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-700 bg-slate-50/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">توضیحات و نیازمندی‌های اقساطی شما</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="کالای شما چیست؟ چه الگوهای قسط‌بندی مد نظر شماست؟"
                        rows={3}
                        className="w-full text-sm px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-700 bg-slate-50/50 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                     ارسال پیام 
                    </button>

                  </form>
                </div>

              </div>
            ) : (
              // STEP 2: The Awesome Mock Admin Dashboard Simulator!
              <div className="p-4 md:p-6 w-full">
                
                {/* Header of Simulated Dashboard */}
                <div className="bg-slate-950 text-white rounded-2xl p-4 md:p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <LayoutDashboard className="w-5 h-5 text-primary" />
                      <h4 className="font-bold text-sm">پنل مدیریت هوشمند قسطیت</h4>
                      <span className="text-[9px] bg-primary/20 text-primary border border-primary/20 px-1.5 py-0.5 rounded-full font-bold">
                        تست زنده فعال
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      میز کار مدیریت اقساط فروشگاه <span className="text-white font-bold">{formData.businessName || 'شما'}</span>
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={handleCreateDemoClient}
                      className="bg-primary hover:bg-primary-hover text-white text-[11px] font-bold px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5" /> افزودن مشتری و قسط جدید (شما)
                    </button>
                    <button
                      onClick={resetForm}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] px-3 py-1.5 rounded-xl transition-colors"
                    >
                      ثبت درخواست جدید
                    </button>
                  </div>
                </div>

                {/* Dashboard Tabs Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  
                  {/* Sidebar - Left inside panel (3 cols) */}
                  <div className="md:col-span-3 space-y-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-extrabold block px-2 mb-1 uppercase tracking-wider">منوی میانبر پنل</span>
                    {[
                      { id: 'overview', label: 'اعتبارسنجی و وضعیت', icon: Users },
                      { id: 'contracts', label: 'چاپ اتوماتیک قرارداد', icon: Printer },
                      { id: 'sms', label: 'پیامک یادآور خودکار', icon: MessageSquare }
                    ].map((tab) => {
                      const IconComp = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as any)}
                          className={`w-full text-right p-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                            activeTab === tab.id
                              ? 'bg-primary text-white shadow-sm'
                              : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-800'
                          }`}
                        >
                          <IconComp className="w-4 h-4" />
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Main Panel Content Area (9 cols) */}
                  <div className="md:col-span-9 bg-white border border-slate-100 rounded-2xl p-4 min-h-[350px]">
                    
                    {/* SUB-SECTION 1: Overview and clients score */}
                    {activeTab === 'overview' && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                          <h5 className="text-xs font-black text-slate-800 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-slate-500" />
                            اسناد اعتبارسنجی بانکی و مشتریان فعال
                          </h5>
                          <span className="text-[10px] text-slate-400 font-mono">Real-time status</span>
                        </div>

                        {/* Clients table list */}
                        <div className="overflow-x-auto">
                          <table className="w-full text-right text-xs">
                            <thead>
                              <tr className="bg-slate-50 text-slate-500 border-b border-slate-100">
                                <th className="p-2 font-bold">نام مشتری</th>
                                <th className="p-2 font-bold">مبلغ پرونده</th>
                                <th className="p-2 font-bold">وضعیت اقساط</th>
                                <th className="p-2 font-bold">اعتبارسنجی</th>
                                <th className="p-2 font-bold">معوقه</th>
                              </tr>
                            </thead>
                            <tbody>
                              {clients.map((c) => (
                                <tr 
                                  key={c.id} 
                                  onClick={() => setSelectedClientContract(c)}
                                  className={`border-b border-slate-50 hover:bg-slate-50/50 transition-colors cursor-pointer ${
                                    selectedClientContract.id === c.id ? 'bg-primary/5 font-extrabold' : ''
                                  }`}
                                >
                                  <td className="p-2 py-3">
                                    <div className="font-extrabold text-slate-800">{c.name}</div>
                                    <span className="text-[10px] text-slate-400">{c.business}</span>
                                  </td>
                                  <td className="p-2 font-sans font-bold text-slate-700">{c.amount}</td>
                                  <td className="p-2 font-bold">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                                      c.status === 'تسویه کامل' 
                                        ? 'bg-emerald-100 text-emerald-800' 
                                        : c.status === 'سررسید گذشته' || c.status === 'معوقه بحرانی'
                                        ? 'bg-rose-100 text-rose-800'
                                        : 'bg-amber-100 text-amber-800'
                                    }`}>
                                      {c.status}
                                    </span>
                                  </td>
                                  <td className="p-2">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                      c.rating.startsWith('A') 
                                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                                        : 'bg-amber-50 text-amber-600 border border-amber-100'
                                    }`}>
                                      رتبه {c.rating}
                                    </span>
                                  </td>
                                  <td className="p-2 font-sans font-black text-rose-500">
                                    {c.overdue > 0 ? `${c.overdue} روز` : '۰'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-100 text-xs text-slate-600 leading-relaxed">
                          <span className="font-extrabold block text-blue-800 mb-1">سیستم اعتبار سنجی کاربران قسطیت چطور کار میکند؟</span>
                          با ثبت اطلاعات هویتی مشتری، سیستم به صورت خودکار استعلام بانکی، سابقه معوقات شتابی و رتبه اعتباری مشتری را در ۱ ثانیه اعلام و ریسک قسط بندی را مشخص میسازد.
                        </div>
                      </div>
                    )}

                    {/* SUB-SECTION 2: Printable dynamic contracts */}
                    {activeTab === 'contracts' && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                          <h5 className="text-xs font-black text-slate-800 flex items-center gap-2">
                            <Printer className="w-4 h-4 text-slate-500" />
                            سیستم چاپ قرارداد اختصاصی اقساطی
                          </h5>
                          <span className="text-[9px] bg-slate-100 text-slate-600 px-2 rounded">قالب حقوقی رسمی</span>
                        </div>

                        {/* Real Printable Contract Draft Card */}
                        <div className="border border-slate-200 p-5 rounded-xl bg-slate-50 relative overflow-hidden text-right font-sans text-[11px] space-y-3 leading-relaxed max-h-[250px] overflow-y-auto custom-scrollbar">
                          {/* Watermark security */}
                          <div className="absolute inset-0 opacity-[0.03] flex items-center justify-center pointer-events-none select-none">
                            <span className="text-5xl font-black text-slate-900 border-8 border-slate-900 p-4 transform -rotate-12">قسطیت</span>
                          </div>

                          <div className="text-center font-sans font-bold border-b border-slate-200 pb-2 mb-2">
                            <h6 className="text-xs">قرارداد رسمی خرید و ارائه خدمات اقساطی</h6>
                            <span className="text-[10px] text-slate-400 block mt-1">شماره پرونده: GHT-{(selectedClientContract.id * 1024)}-FA</span>
                          </div>

                          <p>
                            این سند حقوقی فیمابین فروشگاه خدماتی/کالایی <strong className="text-slate-900 font-sans">{selectedClientContract.business}</strong> (به عنوان فروشنده) و آقا/خانم <strong className="text-slate-900 font-sans">{selectedClientContract.name}</strong> (به عنوان خریدار) با استناد به سیستم هوشمند و ثبت‌شده در <strong className="text-primary font-sans">سامانه قسطیت</strong> با شرایط زیر به صورت لازم‌الاجرا منعقد گردید:
                          </p>

                          <div className="grid grid-cols-2 gap-3 bg-white p-2 rounded border border-slate-100 font-sans text-[10px]">
                            <div><strong>مبلغ توافق طرفین:</strong> {selectedClientContract.amount}</div>
                            <div><strong>تسهیلات پرونده اقساطی:</strong> قسط سیستماتیک</div>
                            <div><strong>رتبه اعتبارسنجی خریدار:</strong> رتبه بانکی {selectedClientContract.rating}</div>
                            <div><strong>مبنای تسویه:</strong> درگاه الکترونیک اختصاصی قسطیت</div>
                          </div>

                          <p>
                            مشتری متعهد می‌شود اقساط ماهیانه را با توجه به سررسیدهای مقرر در پلتفرم به صورت منظم پرداخت کند. در صورت تاخیر، جریمه معوقات به ازای هر روز تاخیر محاسبه و همزمان با پیامکهای یادآوری به خریدار ابلاغ خواهد شد.
                          </p>

                          <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-[10px] font-sans">
                            <span>امضای الکترونیک پذیرنده</span>
                            <span>تایید سامانه مرکزی قسطیت</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => alert('نسخه چاپی PDF قرارداد به زودی برای دانلود به دستگاه شما منتقل می‌شود.')}
                            className="bg-primary hover:bg-primary-hover text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" /> دانلود نسخه آماده چاپ
                          </button>
                          <span className="text-[11px] text-slate-400 self-center leading-normal">
                            * قرارداد بر روی مشتری ست شده است: <strong className="text-slate-700">{selectedClientContract.name}</strong>
                          </span>
                        </div>
                      </div>
                    )}

                    {/* SUB-SECTION 3: SMS scheduler */}
                    {activeTab === 'sms' && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                          <h5 className="text-xs font-black text-slate-800 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-slate-500" />
                            سرور ارسال پیامک یادآور اقساط خودکار قسطیت
                          </h5>
                          <span className="text-[9px] bg-primary/20 text-primary px-2 rounded-full font-bold">پردازش شبانه‌روزی</span>
                        </div>

                        <div className="space-y-3">
                          <div className="bg-slate-50 hover:bg-slate-100 transition-colors p-3.5 rounded-xl border border-slate-100">
                            <div className="flex justify-between text-slate-500 text-[10px] mb-1.5">
                              <span className="font-bold">پیامک اول (۳ روز قبل از سررسید قسط)</span>
                              <span className="text-emerald-500 font-bold">وضعیت: آماده ارسال خودکار</span>
                            </div>
                            <p className="text-xs text-slate-700 font-sans leading-relaxed">
                              « خریدار محترم {selectedClientContract.name}، ۳ روز تا سررسید قسط شما باقی‌مانده است. مبلغ قسط را می‌توانید به راحتی از طریق درگاه اختصاصی پرداخت نمایید. قسطیت »
                            </p>
                          </div>

                          <div className="bg-amber-50/50 hover:bg-amber-50 p-3.5 rounded-xl border border-amber-100">
                            <div className="flex justify-between text-slate-500 text-[10px] mb-1.5">
                              <span className="font-bold">پیامک دوم (روز سررسید قسط)</span>
                              <span className="text-amber-600 font-bold">وضعیت: در نوبت ارسال</span>
                            </div>
                            <p className="text-xs text-slate-700 font-sans leading-relaxed">
                              « خریدار گرامی {selectedClientContract.name}، امروز موعد پرداخت قسط شماست. با کلیک بر روی لینک زیر قسط خود را تسویه کنید تا شامل جریمه دیرکرد نشوید: {formData.businessName}.ghestit.com/pay »
                            </p>
                          </div>

                          <div className="bg-rose-50/50 hover:bg-rose-50 p-3.5 rounded-xl border border-rose-100">
                            <div className="flex justify-between text-slate-500 text-[10px] mb-1.5">
                              <span className="font-bold">پیامک سوم (اخطار معوقات و جریمه دیرکرد)</span>
                              <span className="text-rose-600 font-bold">وضعیت: هشدار جریمه فعال</span>
                            </div>
                            <p className="text-xs text-slate-700 font-sans leading-relaxed">
                              « خریدار محترم {selectedClientContract.name}، قسط شما معوق شده است. جریمه دیرکرد روزانه به کل حساب شما اعمال گردید. جهت جلوگیری از تنزل رتبه اعتباری شتاب فورا اقدام کنید. »
                            </p>
                          </div>
                        </div>

                      </div>
                    )}

                  </div>

                </div>

                {/* Footnote of Dashboard simulation */}
                <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400 text-center flex justify-between items-center gap-4">
                  <span>کارشناسان ما به زودی با شماره <strong className="text-slate-800">{formData.phone || 'ثبت شده'}</strong> جهت مشاوره نهایی تماس خواهند گرفت.</span>
                  <button
                    onClick={onClose}
                    className="px-4 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all cursor-pointer"
                  >
                    بستن دمو
                  </button>
                </div>

              </div>
            )}

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
