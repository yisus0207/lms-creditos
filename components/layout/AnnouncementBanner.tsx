'use client';

import { Sparkles } from 'lucide-react';

export default function AnnouncementBanner() {
  return (
    <div className="bg-[#0F0A4D] border-b border-white/10 py-3 px-4 relative overflow-hidden group">
      {/* Animated Background Pulse */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
      
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 relative z-10 text-center">
        <Sparkles className="w-4 h-4 text-[#D4A017] animate-pulse" />
        <p className="text-[11px] sm:text-xs font-black uppercase tracking-[0.15em] text-white/90">
          <span className="text-[#D4A017]">¡PROMO EXCLUSIVA!</span> 🏠 
          Escrituras <span className="underline decoration-[#D4A017] decoration-2 underline-offset-4">GRATIS</span> este mes 
          <span className="mx-2 opacity-30">|</span> 
          <span className="line-through text-white/40 mr-2 font-bold decoration-rose-500/50">$1.800.000</span>
          <span className="bg-[#D4A017] text-[#0F0A4D] px-2 py-0.5 rounded-full text-[9px] font-black italic">LIMITADO</span>
        </p>
      </div>
    </div>
  );
}
