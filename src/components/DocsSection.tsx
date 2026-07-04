import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Play, 
  Pause,
  RotateCcw,
  Settings, 
  UserCheck, 
  Zap, 
  HelpCircle,
  FileSpreadsheet,
  ArrowLeft,
  MessageSquareCode,
  Video,
  Clock,
  ExternalLink,
  Volume2,
  VolumeX,
  Tv
} from 'lucide-react';
import myThumbnail from '../public/ghestitThumbnail.webp';

interface VideoTutorial {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  videoUrl: string;
  thumbnailUrl: string; // fallback visual representation
  category: string;
}

export default function DocsSection() {
  const [activeTab, setActiveTab] = useState<'intro' | 'setup' | 'score' | 'settle'>('intro');
  const [selectedVideo, setSelectedVideo] = useState<VideoTutorial | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const docTabs = [
    {
      id: 'intro',
      label: 'شروع سریع با قسطیت',
      icon: Zap,
      title: 'چگونه فرآیند فروش اقساطی را آغاز کنیم؟',
      content: 'تیم قسطیت به شما کمک می‌کند در کمتر از ۲۴ ساعت زیرساخت اقساط خود را ایجاد کنید. برای این کار کافیست ابتدا درخواست دمو را ثبت کنید، پس از تماس کارشناسان و احراز حاکمیت کسب‌وکار، پنل پذیرنده شما آماده می‌شود و به راحتی می‌توانید مشتریان خود را با هر بازه‌ای تعریف نمایید.',
      points: [
        'ثبت‌نام رسمی کسب‌وکار با یک خط تلفن همراه و کارت معتبر',
        'دریافت درگاه اختصاصی پرداخت اقساط آنلاین متصل به شاپرک',
        'ایجاد اولین پرونده مشتری بدون نیاز به فرآیندهای سنتی کاغذی',
        'امکان اتصال آسان به سایت‌های وردپرس یا انواع CRM از طریق وب‌سرویس'
      ]
    },
    {
      id: 'setup',
      label: 'ساخت اقساط دلخواه',
      icon: Settings,
      title: 'تنظیمات دلخواه شرایط اقساط و سود به ازای فاکتور',
      content: 'قسطیت هیچ الگوی اجباری یا محدود کننده‌ای ندارد. شما در برنامه قسطیت آزاد هستید که بر اساس توانمندی مشتری خود، اقساط دلخواه بسازید و تمام شرایط را شخصی‌سازی کنید:',
      points: [
        'تعداد ماه‌های بازپرداخت از ۳ الی ۲۴ ماه به انتخاب شما',
        'تعیین سود ماهیانه دلخواه به صورت پویا و یا به صورت درصدی روی قیمت کلی',
        'امکان ساخت اقساط نامنظم (مثلاً هر دو یا سه ماه یک‌بار به جای ماهیانه)',
        'قسط‌بندی بدون نیاز به دریافت فیزیکی چک (تنها از طریق تعهد و قرارداد الکترونیک)'
      ]
    },
    {
      id: 'score',
      label: 'اعتبارسنجی خریداران',
      icon: UserCheck,
      title: 'سامانه استعلام آنلاین و اعتبارسنجی رتبه شتاب کاربران',
      content: 'یکی از بزرگترین دغدغه‌های فروشندگان اقساطی، وصول به موقع مطالبات و اهرم‌های امنیتی خریداران است. قسطیت این فرآیند را کاملاً ایمن و تضمین کرده است:',
      points: [
        'استعلام هوشمند کد ملی و رتبه اعتباری مشتری در ثانیه اول',
        'سنجش سابقه چک‌های برگشتی و بدهی‌های معوق بانکی مشتری',
        'سیستم تایید هویت دو مرحله‌ای جهت احراز دقیق شماره همراه با کدملی مشتری',
        'صدور خودکار قرارداد رسمی و تعهدات حقوقی الکترونیک مورد تایید قانون الکترونیک کشور'
      ]
    },
    {
      id: 'settle',
      label: 'درگاه و تسویه حساب',
      icon: FileSpreadsheet,
      title: 'تسویه موازی وجه اقساط با درگاه الکترونیک متصل به شتاب',
      content: 'پرداخت اقساط در قسطیت از طریق لینک پرداخت پیامک‌شده به صورت کاملا آنلاین صورت می‌گیرد و حساب شما در کوتاه‌ترین زمان پس از پرداخت شارژ می‌گردد:',
      points: [
        'لینک اختصاصی و مستقیم پرداخت برای هر قسط مشتری',
        'واریز بلافاصله وجه به شبای بانکی ثبت شده پذیرنده',
        'محاسبه خودکار جریمه دیرکرد روزانه و معطل‌ساز در صورت عدم واریز قسط و اعمال روی فاکتور خریدار',
        'ارائه رسید رسمی چاپی و پیامک تاییدیه واریز با آرم اختصاصی فروشگاه شما'
      ]
    }
  ];

  const videos: VideoTutorial[] = [
    {
      id: 'v1',
      title: 'ساخت نوع اقساط در نرم افزار قسطیت',
      subtitle: 'چگونگی ساخت اقساط',
      duration: '۰۲:۳۸',
      videoUrl: 'https://www.aparat.com/v/mzb5oxp',
      thumbnailUrl: myThumbnail,
      category: 'ساخت اقساط'
    },
    {
      id: 'v2',
      title: 'ساخت کاربر در نرم افزار قسطیت',
      subtitle: 'نحوه ساخت کاربر',
      duration: '۰۱:۲۲',
      videoUrl: 'https://www.aparat.com/v/mnu74d1',
      thumbnailUrl: myThumbnail,
      category: 'ساخت کاربر'
    },
    {
      id: 'v3',
      title: 'ساخت اقساط با چک',
      subtitle: 'نحوه ساخت و مدیریت اقساط با چک',
      duration: '۰۳:۱۵',
      videoUrl: 'https://www.aparat.com/v/ommj99v',
      thumbnailUrl: myThumbnail,
      category: 'ساخت اقساط با چک'
    },
    {
      id: 'v4',
      title: 'آموزش ساخت اقساط بدون چک در نرم افزار قسطیت',
      subtitle: 'نحوه ساخت و مدیریت اقساط بدون چک',
      duration: '۰۲:۵۹',
      videoUrl: 'https://www.aparat.com/v/qkb3k0g',
      thumbnailUrl: myThumbnail,
      category: 'ساخت اقساط بدون چک'
    },
    {
      id: 'v5',
      title: 'گزارش گیری در نرم افزار قسطیت',
      subtitle: 'نحوه گزارش گیری',
      duration: '۰۰:۵۵',
      videoUrl: 'https://www.aparat.com/v/tpg72t2',
      thumbnailUrl: myThumbnail,
      category: 'گزارش گیری'
    }
  ];

  const currentDoc = docTabs.find(tab => tab.id === activeTab) || docTabs[0];

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const restartVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="w-full space-y-12">
    
      {/* Modern Video tutorials Section (فیلم های آموزشی) */}
      <div className="w-full bg-white/95 rounded-3xl border border-slate-100 shadow-xl p-6 md:p-8" id="docs-videos-area">
        
        {/* Section title */}
        <div className="text-right mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-primary rounded-full text-xs font-semibold mb-2">
            <Video className="w-4 h-4" />
            <span>فیلم‌های آموزشی نرم‌افزار</span>
          </div>
          <h2 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight">
            کتابخانه فیلم‌های آموزشی قسطیت
          </h2>
          <p className="text-slate-500 text-xs md:text-sm mt-1 max-w-2x2">
            مستندات را به صورت تصویری دنبال کنید! هر کدام از ویدیوهای کارگاه را انتخاب کنید تا به سادگی روش کار با بخش‌های مختلف را بیاموزید.
          </p>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {videos.map((vid) => (
            <div 
              key={vid.id}
              className="group bg-slate-50/60 rounded-2xl border border-slate-100 overflow-hidden hover:border-primary/30 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video bg-slate-900 overflow-hidden">
                <img 
                  src={vid.thumbnailUrl} 
                  alt={vid.title} 
                  className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual Category Label */}
                <span className="absolute top-2.5 right-2.5 bg-slate-900/90 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full">
                  {vid.category}
                </span>

                {/* Duration */}
                <span className="absolute bottom-2.5 left-2.5 bg-slate-900/90 text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Clock className="w-3 h-3 text-primary" />
                  {vid.duration}
                </span>

                {/* Play Button Overlay */}
                <button 
                  onClick={() => {
                    setSelectedVideo(vid);
                    setIsPlaying(true);
                  }}
                  className="absolute inset-0 m-auto w-11 h-11 bg-primary text-white rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 active:scale-90 transition-all cursor-pointer opacity-90 hover:opacity-100"
                >
                  <Play className="w-5 h-5 fill-white translate-x-[-1px]" />
                </button>
              </div>

              {/* Title & info */}
              <div className="p-4 flex-1 flex flex-col justify-between text-right">
                <div className="space-y-1.5">
                  <h4 className="text-xs font-black text-slate-800 line-clamp-1 group-hover:text-primary transition-colors">
                    {vid.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed line-clamp-2">
                    {vid.subtitle}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-4 flex justify-between items-center text-[10px] font-bold">
                  <span className="text-slate-400 font-mono">ID: {vid.id.toUpperCase()}</span>
                  <button 
                    onClick={() => {
                      setSelectedVideo(vid);
                      setIsPlaying(true);
                    }}
                    className="text-primary hover:text-primary-hover flex items-center gap-1 cursor-pointer"
                  >
                    <span>مشاهده فیلم</span>
                    <ArrowLeft className="w-3 h-3" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Video Player Modal */}
<AnimatePresence>
  {selectedVideo && (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
      onClick={() => {
        setSelectedVideo(null);
        setIsPlaying(false);
      }}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-slate-900 border border-white/10 rounded-3xl overflow-hidden max-w-3xl w-full text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-white/10 flex justify-between items-center bg-slate-950">
          <span className="text-[10px] font-extrabold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
            {selectedVideo.category}
          </span>
          <div className="text-right">
            <h3 className="text-xs font-black">{selectedVideo.title}</h3>
            <p className="text-[9px] text-slate-400 mt-0.5">{selectedVideo.duration} زمان فیلم آموزشی</p>
          </div>
        </div>

        {/* Video / Iframe Frame */}
        <div className="relative bg-slate-950 aspect-video flex items-center justify-center">
          {selectedVideo.videoUrl.includes('aparat.com') ? (
            /* --- شروع بخش اضافه شده برای آپارات --- */
            <iframe
              src={`https://www.aparat.com/video/video/embed/videohash/${selectedVideo.videoUrl.split('/').pop()}/vt/frame?autoplay=${isPlaying ? 1 : 0}`}
              className="w-full h-full absolute inset-0"
              allow="autoplay; fullscreen; accelerated-video"
              allowFullScreen
              title={selectedVideo.title}
            ></iframe>
            /* --- پایان بخش آپارات --- */
          ) : (
            /* پلیر استاندارد برای لینک‌های MP4 */
            <>
              <video 
                ref={videoRef}
                src={selectedVideo.videoUrl} 
                className="w-full h-full"
                autoPlay={isPlaying}
                loop
                playsInline
                muted={isMuted}
              />
              
              {/* دکمه‌های کنترلی فقط برای ویدیوهای غیر آپارات نمایش داده شود */}
              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between gap-4 z-10 opacity-0 hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center gap-3">
                  <button onClick={togglePlay} className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/20 flex items-center justify-center cursor-pointer">
                    {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white translate-x-[-1px]" />}
                  </button>
                  <button onClick={restartVideo} className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/20 flex items-center justify-center cursor-pointer">
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button onClick={toggleMute} className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/20 flex items-center justify-center cursor-pointer">
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <Tv className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-mono text-slate-300">GhestIt Classroom Player</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Subtitle / explanation */}
        <div className="p-5 text-right bg-slate-900/60">
          <h4 className="text-xs font-black text-slate-200">توضیحات و مهارت‌های کسب‌شده:</h4>
          <p className="text-[11px] text-slate-300 leading-relaxed font-sans mt-1.5">
            {selectedVideo.subtitle} با یادگیری مهارت طرح شده، سیستم اقساط آنلاین شما از خطاهای حسابداری و تاخیر وصول در امان می‌ماند.
          </p>
          <button 
            onClick={() => {
              setSelectedVideo(null);
              setIsPlaying(false);
            }}
            className="mt-4 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
          >
            بستن پنجره نمایش
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

      </div>

    </div>
  );
}
