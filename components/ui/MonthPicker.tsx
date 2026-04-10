'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Option {
  id: string; // YYYY-MM
  label: string; // Jan-YYYY
}

interface MonthPickerProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export default function MonthPicker({ 
  options, 
  value, 
  onChange, 
  label,
  className,
  disabled = false
}: MonthPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.id === value);
  const currentYear = new Date().getFullYear();

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("relative space-y-2", className)} ref={containerRef}>
      {label && (
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 pl-1">
          {label}
        </label>
      )}
      
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full h-14 border-none rounded-[22px] px-6 flex items-center justify-between transition-all duration-300",
          disabled ? "bg-gray-50/50 cursor-not-allowed opacity-60" : "bg-gray-50/90 cursor-pointer hover:bg-gray-100",
          isOpen ? "bg-white ring-2 ring-[#D4A017]/20 shadow-md" : "shadow-inner ring-1 ring-gray-200/80"
        )}
      >
        <div className="flex items-center gap-3 text-[#0F0A4D]">
          <Calendar className={cn("w-4 h-4 transition-colors", isOpen ? "text-[#D4A017]" : "text-gray-400")} />
          <span className="text-sm font-bold uppercase tracking-wide">
            {selectedOption ? selectedOption.label : 'Seleccionar mes'}
          </span>
        </div>
        <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform duration-300", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute z-[110] top-full left-0 w-full mt-3 bg-white/95 backdrop-blur-xl border border-white/20 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-5 overflow-hidden origin-top"
          >
            <div className="mb-4 flex items-center justify-between px-2">
              <span className="text-[10px] font-black text-[#0F0A4D]/40 uppercase tracking-[0.2em] italic">
                Selecciona un mes de {currentYear}
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {options.slice().reverse().map((opt) => {
                const isSelected = value === opt.id;
                const monthName = opt.label.split('-')[0];
                
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      onChange(opt.id);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "h-14 flex flex-col items-center justify-center rounded-2xl transition-all duration-300 group relative overflow-hidden ring-1",
                      isSelected 
                        ? "bg-[#0F0A4D] text-[#D4A017] ring-[#0F0A4D] shadow-lg" 
                        : "bg-white/50 text-[#0F0A4D]/70 ring-gray-100 hover:ring-[#D4A017]/30 hover:bg-amber-50"
                    )}
                  >
                    {isSelected && (
                      <motion.div 
                        layoutId="activeMonth"
                        className="absolute inset-0 bg-[#0F0A4D]"
                        style={{ zIndex: -1 }}
                      />
                    )}
                    <span className={cn("text-xs font-black uppercase tracking-widest", isSelected ? "text-[#D4A017]" : "group-hover:text-[#0F0A4D]")}>
                      {monthName}
                    </span>
                    {isSelected && <Check className="w-3 h-3 mt-1 text-[#D4A017]" />}
                  </button>
                );
              })}
            </div>
            
            <div className="mt-4 pt-3 border-t border-gray-100 flex justify-center">
              <button 
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-[9px] font-black text-gray-400 uppercase tracking-widest hover:text-[#0F0A4D] transition-colors"
              >
                Cerrar selector
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
