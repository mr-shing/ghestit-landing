import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Headphones, Smartphone, Infinity, ArrowLeft, Sparkles } from 'lucide-react';
import { panelUrl } from '../lib/config';

export default function AboutUs() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4 }}
      className="py-16 relative overflow-hidden text-right min-h-screen bg-transparent"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Breadcrumbs */}
       
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-[#02A958] border border-emerald-100 rounded-full text-xs font-black mx-auto">
            <Sparkles className="w-3.5 h-3.5 fill-[#02A958]/20" />
            <span>یکپارچگی و امنیت در پرداخت</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
            پلتفرم قسطیت؛ زیرساخت نوآورانه <br />
            <span className="text-[#02A958]">در زمینه فروش اقساطی</span>
          </h1>
          <p className="text-slate-600 text-base md:text-lg leading-relaxed font-sans text-justify md:text-center">
            پلتفرم قسطیت به عنوان یک زیرساخت نوآورانه در زمینه فروش اقساطی طراحی شده است تا کسب‌وکارها و مشتریان را به شکلی ساده و امن به یکدیگر متصل کند. هدف ما فراهم کردن بستری است که فروشندگان بتوانند کالاها و خدمات خود را به صورت اقساطی به فروش برسانند و خریداران نیز بدون نیاز به دغدغه‌های مالی، اقساط خود را به راحتی و در محیطی امن پرداخت کنند.
          </p>
        </div>

        {/* Mission Section (Full Width Highlight) */}
        <div className="p-8 md:p-12 rounded-[2.5rem] bg-white border border-slate-150 shadow-sm mb-20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-2 h-full bg-[#02A958]" />
          <div className="max-w-4xl">
            <span className="text-xs font-black text-[#02A958] uppercase tracking-wider block mb-3">اهداف و آرمان‌ها</span>
            <h2 className="text-2xl font-black text-slate-900 mb-4">مأموریت ما</h2>
            <p className="text-slate-600 leading-relaxed font-sans text-base text-justify">
              ما در قسطیت با ایجاد یک سیستم شفاف و کاربرپسند به دنبال تسهیل فرآیند خرید و فروش اقساطی هستیم. با این زیرساخت، کسب‌وکارها می‌توانند محصولات و خدمات خود را با شرایط مناسب در اختیار مشتریان قرار دهند و در عین حال خریداران نیز از امکان پرداخت آسان و اقساطی بهره‌مند شوند. قسطیت به نحوی طراحی شده که فرایند پرداخت اقساط در همین پلتفرم انجام شود و کلیه مراحل خرید و پرداخت از ابتدا تا انتها در محیطی واحد صورت گیرد.
            </p>
          </div>
        </div>

        {/* Why GhestIt - Grid Section */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-16 text-white relative overflow-hidden shadow-2xl border border-slate-800">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#02A958]/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#02A958]/5 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />
          
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-black text-center mb-4">چرا قسطیت؟</h2>
            <p className="text-slate-400 text-xs font-bold text-center mb-12 font-sans">مزایای کلیدی پلتفرم برای خریداران و پذیرندگان</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { 
                  icon: ShieldCheck, 
                  title: "امنیت و شفافیت", 
                  desc: "تمامی تراکنش‌ها و پرداخت‌های اقساطی در قسطیت با رعایت کامل اصول امنیتی و محرمانگی انجام می‌شود." 
                },
                { 
                  icon: Headphones, 
                  title: "پشتیبانی جامع", 
                  desc: "تیم پشتیبانی قسطیت در تمام مراحل خرید و پرداخت همراه شماست تا تجربه‌ای لذت‌بخش از خرید و فروش اقساطی داشته باشید." 
                },
                { 
                  icon: Smartphone, 
                  title: "سهولت استفاده", 
                  desc: "چه کسب‌وکار باشید و چه خریدار، فرایند استفاده از قسطیت بسیار ساده و قابل فهم است." 
                },
                { 
                  icon: Infinity, 
                  title: "کسب‌وکارهای نامحدود", 
                  desc: "در قسطیت هیچ‌گونه محدودیتی برای کسب و کارها وجود ندارد، بنابراین همه کسب‌وکارها با انواع کالاها و خدمات به پلتفرم دسترسی دارند." 
                },
              ].map((val, i) => (
                <div key={i} className="flex flex-col items-start text-right space-y-4 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-[#02A958]/30 transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-white/5 text-[#02A958] flex items-center justify-center group-hover:bg-[#02A958] group-hover:text-white transition-colors duration-300">
                    <val.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-black text-base text-slate-100">{val.title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed font-sans text-justify">{val.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center bg-gradient-to-b from-white/40 to-transparent p-8 rounded-3xl border border-slate-100/50 backdrop-blur-sm">
          <h3 className="text-lg md:text-xl font-black text-slate-800 mb-2">به ما بپیوندید و تجربه‌ای متفاوت از خرید و فروش اقساطی را داشته باشید</h3>
          <p className="text-slate-500 text-xs font-bold mb-6 font-sans">آماده هوشمندسازی کانال‌های فروش و اعتبارسنجی خود هستید؟</p>
          <a 
            href={panelUrl('/company/create?type=1')} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#02A958] hover:bg-[#02904F] text-white rounded-2xl font-black text-sm transition-all shadow-lg shadow-emerald-500/10 active:scale-95 no-underline"
          >
            <span>پیوستن به قسطیت</span>
            <ArrowLeft className="w-4 h-4" />
          </a>
        </div>

      </div>
    </motion.div>
  );
}