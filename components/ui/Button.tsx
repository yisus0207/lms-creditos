import { cn } from '@/lib/utils';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  loading?: boolean;
  icon?: ReactNode;
}

const variantStyles: Record<string, string> = {
  primary:
    'bg-[#D4A017] text-[#0F0A4D] font-black hover:bg-[#b8891c] active:scale-95 shadow-lg shadow-amber-100',
  secondary:
    'bg-[#0F0A4D] text-white font-black hover:bg-[#132b56] active:scale-95 shadow-lg shadow-navy-100',
  ghost:
    'bg-transparent text-[#0F0A4D] border-2 border-[#0F0A4D] font-black hover:bg-[#0F0A4D]/5 active:scale-95',
  danger:
    'bg-red-500 text-white font-black hover:bg-red-600 active:scale-95',
};

const sizeStyles: Record<string, string> = {
  sm: 'px-4 py-2 text-xs rounded-xl',
  md: 'px-6 py-3 text-sm rounded-2xl',
  lg: 'px-8 py-4 text-base rounded-[20px]',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  loading,
  icon,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2.5 transition-all duration-300',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
