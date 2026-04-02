import Card from './Card';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  loading?: boolean;
}

export default function StatCard({
  title,
  value,
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
    <Card className="group overflow-hidden px-4 py-5 animate-reveal-up" padding="none">
      <div className="flex items-center gap-4 min-w-0">
        {icon && (
          <div className="relative shrink-0">
            <div className="absolute inset-0 bg-[#D4A017] blur-xl opacity-5 group-hover:opacity-10 transition-opacity" />
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-[#0F0A4D]/5 border border-gray-100/50 text-[#0F0A4D] group-hover:bg-[#0F0A4D] group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-sm overflow-hidden text-sm sm:text-base">
              <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 skew-x-12" />
              {icon}
            </div>
          </div>
        )}

        <div className="space-y-1 min-w-0 flex-1 overflow-visible group-hover:translate-x-1 transition-transform duration-500">
          <div className="flex items-center gap-1.5 min-w-0">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.15em] whitespace-nowrap overflow-hidden">
              {title}
            </p>
            {trend && (
              <div className={cn("inline-flex shrink-0 items-center px-1 py-0.5 rounded-full text-[8px] font-black transition-colors uppercase tracking-tight", trendColor)}>
                {trendIcon}
              </div>
            )}
          </div>
          
          <div className="min-w-0">
            <p className="text-xl sm:text-2xl font-black text-[#0F0A4D] tracking-tighter leading-none transition-all duration-500 whitespace-nowrap overflow-visible group-hover:scale-105 origin-left">
              {value}
            </p>
            {subtitle && (
              <p className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter opacity-70 whitespace-nowrap overflow-hidden">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
