'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Option {
  id: string;
  label: string;
  sublabel?: string;
}

interface SearchableSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export default function SearchableSelect({ 
  options, 
  value, 
  onChange, 
  placeholder = "Seleccionar...", 
  label,
  className,
  disabled = false
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.id === value);

  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (opt.sublabel && opt.sublabel.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
        <label className="block text-[11px] font-black text-[#0F0A4D]/40 uppercase tracking-widest mb-3">
          {label}
        </label>
      )}
      
      <div 
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          "w-full h-16 border-2 rounded-[24px] px-8 flex items-center justify-between transition-all duration-300 group",
          disabled ? "bg-gray-100/50 border-gray-100 cursor-not-allowed opacity-60" : "bg-gray-50 cursor-pointer",
          isOpen ? "border-[#D4A017] bg-white ring-4 ring-amber-400/5 shadow-xl" : !disabled && "border-gray-100 hover:border-gray-200"
        )}
      >
        <div className="flex flex-col">
          {selectedOption ? (
            <>
              <span className="text-sm font-black text-[#0F0A4D]">{selectedOption.label}</span>
              {selectedOption.sublabel && (
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{selectedOption.sublabel}</span>
              )}
            </>
          ) : (
            <span className="text-sm font-bold text-gray-300">{placeholder}</span>
          )}
        </div>
        <ChevronDown className={cn("w-5 h-5 text-[#D4A017] transition-transform duration-300", isOpen && "rotate-180")} />
      </div>

      {isOpen && (
        <div className="absolute z-[110] top-full left-0 w-full mt-3 bg-white border border-gray-100 rounded-[32px] shadow-2xl p-4 animate-in fade-in zoom-in-95 duration-200 origin-top">
          {/* Search Input */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            <input 
              autoFocus
              type="text" 
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 bg-gray-50 border-none rounded-2xl pl-12 pr-4 text-sm font-bold text-[#0F0A4D] focus:ring-2 focus:ring-[#D4A017]/10"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Options List */}
          <div className="max-h-[250px] overflow-y-auto custom-scrollbar space-y-1 pr-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(opt => (
                <div 
                  key={opt.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(opt.id);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border-2",
                    value === opt.id 
                      ? "bg-amber-50 border-amber-100 text-[#0F0A4D]" 
                      : "border-transparent hover:bg-gray-50 text-gray-600 hover:text-[#0F0A4D]"
                  )}
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-black">{opt.label}</span>
                    {opt.sublabel && (
                      <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest">{opt.sublabel}</span>
                    )}
                  </div>
                  {value === opt.id && <Check className="w-4 h-4 text-[#D4A017]" />}
                </div>
              ))
            ) : (
              <div className="p-8 text-center bg-gray-50 rounded-2xl italic text-xs text-gray-400 font-medium">
                No se encontraron resultados
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
