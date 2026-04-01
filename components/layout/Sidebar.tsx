'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { APP_NAME, NAV_LINKS_DASHBOARD } from '@/constants';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  DollarSign,
  FileText,
  Briefcase,
  ChevronRight,
  ShieldCheck,
  LogOut
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

const ICON_MAP: Record<string, any> = {
  LayoutDashboard,
  Users,
  DollarSign,
  FileText,
  Briefcase,
};

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        setUserEmail(session.user.email);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
    } catch (err) {
      console.error('Logout error:', err);
      // Fallback redirect
      router.push('/');
    }
  };

  return (
    <aside className="hidden lg:flex h-full w-72 flex-col bg-[#0F0A4D] border-r border-white/5 shadow-2xl z-50">
      {/* Brand */}
      <div className="flex h-24 items-center px-8 border-b border-white/5 bg-[#0F0A4D]">
        <img
          src="/images/logo.jpg"
          alt="LMS Logo"
          className="w-12 h-12 rounded-xl border border-white/10 shadow-lg mr-4 transition-transform hover:scale-105"
        />
        <div className="flex flex-col">
          <h1 className="text-lg font-black text-white tracking-tighter uppercase leading-none">LMS</h1>
          <p className="text-[10px] font-bold text-[#D4A017] tracking-[0.2em] mt-1 uppercase leading-none">Management</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-8 space-y-2 custom-scrollbar">
        <p className="px-4 text-[10px] font-black text-white/30 uppercase tracking-[0.25em] mb-4">Menú Principal</p>
        <ul className="space-y-2">
          {NAV_LINKS_DASHBOARD.map((link) => {
            const isActive =
              link.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname === link.href || pathname.startsWith(link.href + '/');

            const Icon = ICON_MAP[link.icon as string] || FileText;

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    'flex items-center gap-4 rounded-[20px] px-5 py-3.5 text-sm font-bold transition-all duration-300 group relative',
                    isActive
                      ? 'bg-gradient-to-r from-[#D4A017] to-[#efac1d] text-[#0F0A4D] shadow-lg shadow-amber-900/20 translate-x-1'
                      : 'text-white/60 hover:bg-white/5 hover:text-white hover:translate-x-1'
                  )}
                >
                  <Icon className={cn(
                    "w-5 h-5 transition-transform group-hover:scale-110",
                    isActive ? "text-[#0F0A4D]" : "text-[#D4A017]"
                  )} />
                  <span className="flex-1">{link.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 opacity-50" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-white/5 bg-[#08152b]/50">
        <button
          onClick={handleLogout}
          className="w-full bg-white/5 hover:bg-rose-500/10 rounded-2xl p-4 flex items-center gap-3 transition-all duration-300 group/logout border border-transparent hover:border-rose-500/30"
        >
          <div className="w-8 h-8 rounded-full bg-[#D4A017]/20 group-hover/logout:bg-rose-500/20 flex items-center justify-center text-[#D4A017] group-hover/logout:text-rose-500 text-[10px] font-black transition-colors uppercase">
            {userEmail?.substring(0, 2) || 'AD'}
          </div>
          <div className="flex-1 text-left overflow-hidden">
            <p className="text-[10px] font-black text-white uppercase tracking-wider truncate">
              {userEmail || 'Administrador'}
            </p>
            <p className="text-[9px] text-[#D4A017] font-bold group-hover/logout:text-rose-500/70 transition-colors uppercase tracking-widest">Cierre de Sesión</p>
          </div>
          <LogOut className="w-4 h-4 text-white/20 group-hover/logout:text-rose-500 transition-colors" />
        </button>
      </div>
    </aside>
  );
}
