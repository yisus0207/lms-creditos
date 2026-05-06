'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  DollarSign,
  Briefcase,
  Receipt,
  LogOut,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

/**
 * Fuente única de verdad para la tab bar mobile.
 * Máximo 5 tabs para que quepan bien en pantallas pequeñas.
 * El 6to slot es el botón de logout.
 */
const NAV_TABS = [
  { label: 'Inicio',    href: '/dashboard',    icon: LayoutDashboard },
  { label: 'Clientes',  href: '/clientes',     icon: Users },
  { label: 'Ingresos',  href: '/ingresos',     icon: DollarSign },
  { label: 'Gastos',    href: '/mis-gastos',   icon: Receipt },
  { label: 'Subsidios', href: '/operaciones',  icon: Briefcase },
];

export default function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      /* ignore */
    } finally {
      router.push('/');
    }
  };

  return (
    <nav className="mobile-tab-bar bg-[#0F0A4D] border-t border-white/10">
      {NAV_TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive =
          pathname === tab.href ||
          (tab.href !== '/dashboard' && pathname.startsWith(tab.href));

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              'flex flex-1 flex-col items-center justify-center gap-1 transition-all duration-200 relative',
              isActive ? 'text-[#D4A017]' : 'text-white/40 hover:text-white/70'
            )}
          >
            {/* Indicador activo — línea en la parte superior */}
            {isActive && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-[#D4A017]" />
            )}

            <Icon
              className={cn(
                'w-5 h-5 transition-transform duration-200',
                isActive ? 'scale-110' : 'scale-100'
              )}
            />
            <span className="text-[9px] font-bold uppercase tracking-wider leading-none">
              {tab.label}
            </span>
          </Link>
        );
      })}

      {/* Logout — último slot */}
      <button
        onClick={handleLogout}
        className="flex flex-1 flex-col items-center justify-center gap-1 text-white/30 hover:text-rose-400 transition-colors duration-200"
      >
        <LogOut className="w-5 h-5" />
        <span className="text-[9px] font-bold uppercase tracking-wider leading-none">Salir</span>
      </button>
    </nav>
  );
}
