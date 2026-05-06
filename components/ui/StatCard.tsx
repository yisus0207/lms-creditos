import Card from './Card';
import { cn, formatCompact } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  rawValue?: number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  loading?: boolean;
}

export default function StatCard({
  title,
  value,
  rawValue,
  subtitle,
  icon,
  trend,
  loading = false,
}: StatCardProps) {
  const isUp = trend === 'up';
  const isDown = trend === 'down';

  const trendIcon = isUp ? <ArrowUpRight className="w-3 h-3 shrink-0" /> : isDown ? <ArrowDownRight className="w-3 h-3 shrink-0" /> : <Minus className="w-3 h-3 shrink-0" />;
  const trendColor = isUp ? 'text-emerald-500 bg-emerald-50' : isDown ? 'text-rose-500 bg-rose-50' : 'text-gray-400 bg-gray-50';

  if (loading) {
    return (
      <Card className="animate-pulse">
        <div className="h-4 bg-gray-100 rounded w-1/3 mb-4" />
        <div className="h-8 bg-gray-200 rounded w-2/3" />
      </Card>
    );
  }

  return (
    <Card className="group overflow-hidden px-3 py-3 sm:px-4 sm:py-5 animate-reveal-up" padding="none">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 min-w-0">
        <div className="flex items-center justify-between w-full sm:w-auto">
          {icon && (
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-[#D4A017] blur-xl opacity-5 group-hover:opacity-10 transition-opacity" />
              <div className="relative flex h-7 w-7 sm:h-11 sm:w-11 items-center justify-center rounded-xl sm:rounded-xl bg-[#0F0A4D]/5 border border-gray-100/50 text-[#0F0A4D] group-hover:bg-[#0F0A4D] group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-sm overflow-hidden text-xs sm:text-sm">
                <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 skew-x-12" />
                {icon}
              </div>
            </div>
          )}
          {trend && (
            <div className={cn("sm:hidden inline-flex shrink-0 items-center px-1.5 py-0.5 rounded-full text-[8px] font-black transition-colors uppercase tracking-tight", trendColor)}>
              {trendIcon}
            </div>
          )}
        </div>

        <div className="space-y-0.5 sm:space-y-1 min-w-0 flex-1 w-full overflow-visible group-hover:translate-x-1 transition-transform duration-500">
          <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
            <p className="text-[9px] sm:text-[9px] font-black text-gray-400 uppercase tracking-[0.12em] sm:tracking-[0.15em] whitespace-nowrap overflow-hidden text-ellipsis">
              {title}
            </p>
            {trend && (
              <div className={cn("hidden sm:inline-flex shrink-0 items-center px-1 py-0.5 rounded-full text-[8px] font-black transition-colors uppercase tracking-tight", trendColor)}>
                {trendIcon}
              </div>
            )}
          </div>
          
          <div className="min-w-0">
            <p className="text-[10px] sm:text-[13px] md:text-xl font-black text-[#0F0A4D] tracking-tighter leading-tight transition-all duration-500 whitespace-nowrap overflow-hidden text-ellipsis group-hover:scale-105 origin-left">
              {value}
            </p>
            {subtitle && (
              <p className="text-[7px] sm:text-[8px] font-bold text-gray-400 uppercase tracking-tighter opacity-70 whitespace-nowrap overflow-hidden">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
