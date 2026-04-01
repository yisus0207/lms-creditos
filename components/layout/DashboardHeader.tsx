'use client';

import { ChevronRight, Layout, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface DashboardHeaderProps {
  title: string;
  description?: string;
  subtitle?: string; // Support for subtitle if used instead of description
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
    <div className="relative mb-10 animate-in slide-in-from-top-4 duration-700">
      {/* Premium Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">
        {segments.map((segment, index) => (
          <div key={segment} className="flex items-center gap-2">
            {index > 0 && <ChevronRight className="w-3 h-3 text-gray-300" />}
            <span className={cn(
              index === segments.length - 1 ? "text-[#D4A017]" : "hover:text-[#0F0A4D] transition-colors cursor-default"
            )}>
              {segment === 'dashboard' ? 'Admin' : segment}
            </span>
          </div>
        ))}
        <div className="ml-auto flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] text-emerald-600 font-black">Sistema Live</span>
        </div>
      </nav>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative">
        <div className="relative pl-8">
          {/* Vertical Decoration */}
          <div className="absolute left-0 top-1 bottom-1 w-1.5 rounded-full bg-gradient-to-b from-[#D4A017] to-[#B8860B] shadow-[0_0_15px_rgba(212,160,23,0.3)]" />
          
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-black text-[#0F0A4D] tracking-tight">{title}</h1>
            <Sparkles className="w-5 h-5 text-[#D4A017] opacity-50" />
          </div>
          
          {displayDescription && (
            <p className="text-gray-400 font-medium max-w-2xl leading-relaxed">
              {displayDescription}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-3 bg-white p-2 rounded-[24px] border border-gray-100 shadow-sm self-start md:self-end">
            {actions}
          </div>
        )}
      </div>

      {/* Subtle bottom separator */}
      <div className="mt-8 h-px w-full bg-gradient-to-r from-gray-100 via-gray-50 to-transparent" />
    </div>
  );
}
