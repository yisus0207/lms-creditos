'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Option {
  id: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export default function Select({ 
  options, 
  value, 
  onChange, 
  placeholder = "Seleccionar...", 
  label,
  className,
  disabled = false
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.id === value);

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
        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest px-1">
          {label}
        </label>
      )}
      
      <div 
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          "w-full h-14 border-none rounded-2xl px-6 flex items-center justify-between transition-all duration-300",
          disabled ? "bg-gray-100/50 cursor-not-allowed opacity-60" : "bg-gray-50 cursor-pointer hover:bg-gray-100/80",
          isOpen ? "bg-white ring-2 ring-[#D4A017]/20 shadow-lg" : ""
        )}
      >
        <span className={cn("text-sm font-medium", !selectedOption ? "text-gray-300" : "text-[#0F0A4D]")}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform duration-300", isOpen && "rotate-180")} />
      </div>

      {isOpen && (
        <div className="absolute z-[110] top-full left-0 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top">
          <div className="max-h-[200px] overflow-y-auto custom-scrollbar p-1">
            {options.map(opt => (
              <div 
                key={opt.id}
                onClick={() => {
                  onChange(opt.id);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex items-center justify-between px-5 py-3.5 rounded-xl cursor-pointer transition-all",
                  value === opt.id 
                    ? "bg-amber-50 text-[#D4A017] font-bold" 
                    : "hover:bg-gray-50 text-gray-600"
                )}
              >
                <span className="text-sm">{opt.label}</span>
                {value === opt.id && <Check className="w-4 h-4" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
