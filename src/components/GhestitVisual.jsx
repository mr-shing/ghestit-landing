import React from 'react';
import { ShieldCheck, TrendingUp, CheckCircle, Users, BarChart3 } from 'lucide-react';

export default function GhestitVisual() {
  return (
    <div className="w-full h-[450px] md:h-[520px] relative flex items-center justify-center select-none perspective-1000">
      
      {/* هاله نورانی وکتور پشت تصویرسازی */}
      <div className="absolute w-72 h-72 md:w-96 md:h-96 bg-gradient-to-tr from-emerald-400/20 to-emerald-600/5 rounded-full blur-3xl animate-[pulse_6s_ease-in-out_infinite] pointer-events-none" />

      {/* ==================== کارت اول: کارت تصویر اصلی (پشت / لایه زیرین) ==================== */}
      {/* تغییر مهم: اضافه شدن will-change-transform برای جلوگیری از تاری در پردازش سه‌بعدی */}
      {/* ==================== کارت اول: کارت تصویر اصلی (پشت / لایه زیرین) ==================== */}
{/* این کارت از قبل overflow-hidden داشت و کاملاً گرد می‌ماند */}
{/* ==================== کارت اول: کارت تصویر اصلی (پشت / لایه زیرین) ==================== */}
{/* اضافه شدن hover:z-50 */}
<div className="absolute z-20 hover:z-50 w-64 h-48 md:w-72 md:h-52 border border-slate-200/80 rounded-[28px] shadow-xl overflow-hidden transform -translate-y-24 -translate-x-4 -rotate-3 hover:rotate-0 hover:translate-y-[-100px] transition-all duration-500 bg-white group will-change-transform">
  <img 
    src="/hero-payment-dashboard.svg" 
    alt="داشبورد پرداخت اقساط قسطیت" 
    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 image-render-crisp"
    style={{ imageRendering: 'auto', transform: 'translateZ(0)' }}
  />
</div>

{/* ==================== کارت دوم: آمار کاربران و خریداران (لایه میانی) ==================== */}
{/* اضافه شدن hover:z-50 */}
<div className="absolute z-30 hover:z-50 w-64 h-32 md:w-62 md:h-46 bg-white/95 border border-slate-200/60 rounded-2xl shadow-2xl transform translate-y-4 translate-x-6 rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-500 group will-change-transform overflow-hidden">
  <img 
    src="/hero-buyer-checkout.svg" 
    alt="خرید اقساطی آنلاین با موبایل" 
    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 image-render-crisp"
    style={{ imageRendering: 'auto', transform: 'translateZ(0)' }}
  />
</div>

{/* ==================== کارت سوم: نرخ وصول و وضعیت تراکنش (جلوی جلو) ==================== */}
{/* اضافه شدن hover:z-50 */}
<div className="absolute z-40 hover:z-50 w-56 h-28 md:w-64 md:h-32 bg-slate-900/95 text-white rounded-2xl shadow-2xl transform translate-y-28 -translate-x-8 -rotate-2 hover:rotate-0 hover:translate-y-24 transition-all duration-500 group will-change-transform overflow-hidden">
  <img 
    src="/hero-cashflow.svg" 
    alt="مدیریت جریان نقدی و وصول اقساط" 
    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 image-render-crisp"
    style={{ imageRendering: 'auto', transform: 'translateZ(0)' }}
  />
</div>

      {/* ==================== المان‌های شناور جانبی ==================== */}
      <div className="absolute top-2 left-0 md:-left-8 z-50 bg-white/95 border border-white/80 p-3 rounded-xl shadow-xl flex items-center gap-2.5 animate-[bounce_4s_ease-in-out_infinite]">
        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
          <TrendingUp className="w-4 h-4" />
        </div>
        <div className="text-right">
          <span className="block text-[18px] font-bold text-slate-600">رشد فروش</span>
          <span className="block text-xs font-black text-slate-800 dir-ltr">+۴۵٪</span>
        </div>
      </div>

      <div className="absolute bottom-4 right-0 md:-right-8 z-50 bg-white/95 border border-white/80 p-3 rounded-xl shadow-xl flex items-center gap-2.5 animate-[bounce_4.5s_ease-in-out_infinite_0.5s]">
        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-[#02A958]">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div className="text-right">
          <span className="block text-[18px] font-black text-slate-800">بدون وا‌سطه</span>
                    <span className="block text-xs font-black text-slate-800 dir-ltr">تضمین با چک صیادی</span>
        </div>
      </div>

      {/* خطوط هندسی کمکی پس‌زمینه */}
      <div className="absolute w-[380px] h-[380px] md:w-[460px] md:h-[460px] border border-dashed border-slate-200 rounded-full pointer-events-none animate-[spin_50s_linear_infinite]" />
      <div className="absolute w-[280px] h-[280px] md:w-[340px] md:h-[340px] border border-slate-100 rounded-full pointer-events-none" />

    </div>
  );
}