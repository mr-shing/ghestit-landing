import { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Building2, CreditCard, KeyRound, LayoutList, LifeBuoy, LogOut, ChevronDown, Download } from 'lucide-react';
import { useAuth, userDisplayName } from '../../auth/AuthContext';

const navItems = [
  { to: '/app/installments', label: 'اقساط', icon: LayoutList },
  { to: '/app/credits', label: 'اعتبارها', icon: CreditCard },
  { to: '/app/companies', label: 'کسب‌وکارها', icon: Building2 },
  { to: '/app/tickets', label: 'پشتیبانی', icon: LifeBuoy },
];

export default function AppLayout() {
  const { user } = useAuth();
  const name = userDisplayName(user);

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900" dir="rtl">
      <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <NavLink to="/app/installments" className="flex items-center gap-2 shrink-0">
            <img src="/logoghestit.png" alt="قسطیت" className="h-9" />
          </NavLink>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                    isActive ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-100'
                  }`
                }
              >
                <Icon size={18} /> {label}
              </NavLink>
            ))}
          </nav>

          <ProfileMenu name={name} username={user?.username} />
        </div>

        {/* mobile nav */}
        <nav className="md:hidden flex items-center justify-around border-t border-slate-100 px-2 py-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg text-[11px] font-bold ${
                  isActive ? 'text-primary' : 'text-slate-500'
                }`
              }
            >
              <Icon size={20} /> {label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}

function ProfileMenu({ name, username }: { name: string; username?: string }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const initial = (name || username || '؟').trim().charAt(0);

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full pr-1 pl-2 py-1 hover:bg-slate-100 transition-colors"
      >
        <span className="grid place-items-center w-9 h-9 rounded-full bg-primary text-white font-black text-sm">
          {initial}
        </span>
        <span className="hidden sm:block text-sm font-bold text-slate-700 max-w-[10rem] truncate">{name}</span>
        <ChevronDown size={16} className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-60 bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-50">
            <p className="font-black text-slate-800 truncate">{name}</p>
            {username && <p className="text-xs text-slate-400 mt-0.5" dir="ltr">{username}</p>}
          </div>
          <NavLink
            to="/app/change-password"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
          >
            <KeyRound size={17} /> تغییر رمز عبور
          </NavLink>
          <NavLink
            to="/download"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
          >
            <Download size={17} /> دانلود اپلیکیشن
          </NavLink>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50"
          >
            <LogOut size={17} /> خروج از حساب
          </button>
        </div>
      )}
    </div>
  );
}
