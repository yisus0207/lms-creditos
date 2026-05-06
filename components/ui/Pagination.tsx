'use client';

import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className={cn('p-4 sm:p-8 border-t border-gray-50 bg-gray-50/50 flex items-center justify-between gap-4', className)}>
      <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap">
        Pág. {currentPage} / {totalPages}
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-xl bg-white border border-gray-100 text-[#0F0A4D] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-all shadow-sm"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Números — solo en sm+ */}
        <div className="hidden sm:flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => onPageChange(num)}
              className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black transition-all',
                currentPage === num
                  ? 'bg-[#D4A017] text-[#0F0A4D] shadow-lg shadow-amber-900/10'
                  : 'bg-white border border-gray-100 text-gray-400 hover:bg-gray-100'
              )}
            >
              {num}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-xl bg-white border border-gray-100 text-[#0F0A4D] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-all shadow-sm"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
}
