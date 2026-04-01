'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  DollarSign, 
  Briefcase, 
  UserCircle,
  FileText,
  LogOut
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const NAV_ITEMS = [
  { label: 'Inicio', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Clientes', href: '/clientes', icon: Users },
  { label: 'Ingresos', href: '/ingresos', icon: DollarSign },
  { label: 'Docs', href: '/documentos', icon: FileText },
  { label: 'Portal', href: '/portal', icon: Briefcase },
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden px-2 pb-6 pt-2">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around rounded-[24px] bg-[#0F0A4D] border border-white/10 shadow-[0_-10px_40px_rgba(15,10,77,0.4)]">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 transition-all duration-300 relative px-2 py-2 min-w-[50px]",
                isActive ? "text-[#D4A017]" : "text-white/60 hover:text-white/90"
              )}
            >
              <Icon className={cn(
                "w-5 h-5 transition-transform",
                isActive ? "scale-110 drop-shadow-[0_0_8px_rgba(212,160,23,0.5)]" : "scale-100"
              )} />
              <span className="text-[9px] font-black uppercase tracking-widest leading-none">{item.label}</span>
              
              {isActive && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#D4A017] shadow-[0_0_8px_rgba(212,160,23,0.8)]" />
              )}
            </Link>
          );
        })}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-1 text-white/60 hover:text-rose-400 transition-all duration-300 px-2 py-2 min-w-[50px]"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-[9px] font-black uppercase tracking-widest leading-none">Salir</span>
        </button>
      </div>
    </nav>
  );
}
