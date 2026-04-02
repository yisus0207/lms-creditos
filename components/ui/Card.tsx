import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg' | 'none';
  hasAccent?: boolean;
}

const paddingStyles = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-4 sm:p-5 md:p-6',
  lg: 'p-6 sm:p-8',
};

export default function Card({
  children,
  className,
  padding = 'md',
  hasAccent = false,
}: CardProps) {
  return (
    <div
      className={cn(
        'relative bg-white rounded-[32px] border border-gray-100 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] overflow-hidden group transition-all duration-500 hover:shadow-[0_12px_44px_-10px_rgba(0,0,0,0.12)] hover:-translate-y-1.5 animate-reveal-up',
        paddingStyles[padding],
        hasAccent && 'pl-10',
        className
      )}
    >
      {hasAccent && (
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#D4A017] to-[#B8860B] opacity-80" />
      )}
      <div className="relative">
        {children}
      </div>
    </div>
  );
}
