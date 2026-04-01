'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { APP_NAME, NAV_LINKS_PUBLIC } from '@/constants';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#0F0A4D] shadow-lg transition-all duration-300">
      <div className="mx-auto h-16 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-full items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img 
                src="/images/logo.jpg" 
                alt="LMS Logo" 
                className="h-10 w-auto rounded-lg shadow-md border border-white/5 transition-transform group-hover:scale-105"
              />
              <div className="absolute -inset-1 bg-[#D4A017]/10 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black text-white leading-none tracking-tight">LMS</span>
              <span className="text-[10px] font-bold text-[#D4A017] uppercase tracking-widest mt-1">Créditos</span>
            </div>
          </Link>

          {/* Nav links - Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS_PUBLIC.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-white/80 transition-colors hover:text-[#D4A017]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="hidden sm:block rounded-lg bg-[#D4A017] px-4 py-2 text-sm font-semibold text-[#0F0A4D] transition-colors hover:bg-[#b8891c]"
            >
              Iniciar sesión
            </Link>
            
            <button 
              className="md:hidden p-2 text-white hover:text-[#D4A017] transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-[#0F0A4D] border-b border-white/5 animate-in slide-in-from-top-4 duration-300 shadow-2xl">
          <nav className="flex flex-col p-6 gap-4">
            {NAV_LINKS_PUBLIC.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-base font-bold text-white/90 hover:text-[#D4A017] flex items-center justify-between"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
                <div className="w-1.5 h-1.5 rounded-full bg-[#D4A017]/30" />
              </Link>
            ))}
            <div className="pt-4 border-t border-white/5">
              <Link
                href="/login"
                className="flex items-center justify-center w-full rounded-xl bg-[#D4A017] py-4 text-sm font-black text-[#0F0A4D] uppercase tracking-widest"
                onClick={() => setIsMenuOpen(false)}
              >
                Iniciar Sesión
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
