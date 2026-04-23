'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  DollarSign, 
  Briefcase, 
  LogOut,
  Receipt,
  Landmark
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const NAV_ITEMS = [
  { label: 'Inicio', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Clientes', href: '/clientes', icon: Users },
  { label: 'Ingresos', href: '/ingresos', icon: DollarSign },
  { label: 'Gastos', href: '/mis-gastos', icon: Receipt },
  { label: 'Subs', href: '/operaciones', icon: Briefcase },
  { label: 'Bancos', href: '/bancos', icon: Landmark },
];

export default function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
    } catch (err) {
      console.error('Logout error:', err);
      router.push('/');
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden px-2 pb-6 pt-2 pointer-events-none">
      <div className="mx-auto flex h-16 max-w-lg items-center px-4 rounded-[24px] bg-[#0F0A4D]/95 backdrop-blur-md border border-white/10 shadow-[0_-10px_40px_rgba(15,10,77,0.5)] pointer-events-auto overflow-x-auto no-scrollbar scroll-smooth">
        <div className="flex items-center gap-3 min-w-max px-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 transition-all duration-300 relative py-1 min-w-[60px]",
                  isActive ? "text-[#D4A017]" : "text-white/50 hover:text-white/90"
                )}
              >
                <Icon className={cn(
                  "w-5 h-5 transition-transform",
                  isActive ? "scale-110 drop-shadow-[0_0_8px_rgba(212,160,23,0.5)]" : "scale-100"
                )} />
                <span className="text-[8px] font-bold uppercase tracking-tight leading-none whitespace-nowrap">{item.label}</span>
                
                {isActive && (
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#D4A017] shadow-[0_0_10px_rgba(212,160,23,0.8)]" />
                )}
              </Link>
            );
          })}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center gap-1 text-white/50 hover:text-rose-400 transition-all duration-300 py-1 min-w-[60px]"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-[8px] font-bold uppercase tracking-tight leading-none">Salir</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
