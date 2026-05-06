'use client';

import { ChevronRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

interface DashboardHeaderProps {
  title: string;
  description?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function DashboardHeader({
  title,
  description,
  subtitle,
  actions,
}: DashboardHeaderProps) {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const displayDescription = description || subtitle;

  return (
    <div className="relative mb-6 lg:mb-10 animate-in slide-in-from-top-4 duration-700">
      {/* Breadcrumbs — ocultos en mobile para ahorrar espacio */}
      <nav className="hidden sm:flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">
        {segments.map((segment, index) => (
          <div key={segment} className="flex items-center gap-2">
            {index > 0 && <ChevronRight className="w-3 h-3 text-gray-300" />}
            <span
              className={cn(
                index === segments.length - 1
                  ? 'text-[#D4A017]'
                  : 'hover:text-[#0F0A4D] transition-colors cursor-default'
              )}
            >
              {segment === 'dashboard' ? 'Admin' : segment}
            </span>
          </div>
        ))}
        <div className="ml-auto flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] text-emerald-600 font-black">Sistema Live</span>
        </div>
      </nav>

      {/* Indicador live compacto — solo mobile */}
      <div className="flex sm:hidden justify-end mb-2">
        <div className="flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] text-emerald-600 font-black">Live</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 relative">
        <div className="relative pl-6 sm:pl-8">
          {/* Barra decorativa izquierda */}
          <div className="absolute left-0 top-1 bottom-1 w-1 sm:w-1.5 rounded-full bg-gradient-to-b from-[#D4A017] to-[#B8860B] shadow-[0_0_15px_rgba(212,160,23,0.3)]" />

          <div className="flex items-center gap-2 mb-1 sm:mb-2">
            {/* Título responsive */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0F0A4D] tracking-tight leading-tight">
              {title}
            </h1>
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4A017] opacity-50 shrink-0" />
          </div>

          {displayDescription && (
            <p className="text-sm text-gray-400 font-medium max-w-2xl leading-relaxed hidden sm:block">
              {displayDescription}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 bg-white p-1.5 sm:p-2 rounded-[20px] sm:rounded-[24px] border border-gray-100 shadow-sm self-start sm:self-end">
            {actions}
          </div>
        )}
      </div>

      {/* Separator */}
      <div className="mt-4 sm:mt-8 h-px w-full bg-gradient-to-r from-gray-100 via-gray-50 to-transparent" />
    </div>
  );
}
