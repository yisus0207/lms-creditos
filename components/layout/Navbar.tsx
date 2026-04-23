'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';

// Navbar.tsx
// Componente de navegación principal para la Landing Page
// Animaciones: Transición de fondo al hacer scroll, Drawer lateral para móvil con AnimatePresence
// Dependencias externas: framer-motion, lucide-react

const navLinks = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#servicios', label: 'Servicios' },
  { href: '#testimonios', label: 'Testimonios' },
];

const drawerVariants = {
  hidden: { opacity: 0, x: '100%' },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  },
  exit: {
    opacity: 0,
    x: '100%',
    transition: { ease: 'easeInOut' }
  }
} as const;

const navStyleVariants = {
  top: {
    backgroundColor: 'rgba(15, 10, 77, 1)', // Fondo sólido inicial (Navy) para legibilidad máxima
    boxShadow: 'none',
    backdropFilter: 'blur(0px)'
  },
  scrolled: {
    backgroundColor: 'rgba(15, 10, 77, 0.85)', // Glassmorphism refinado al desplazar
    boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(12px)'
  }
} as const;

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('#inicio');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // init

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Intersection Observer para detectar sección visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: '-20% 0px -80% 0px' }
    );

    navLinks.forEach((link) => {
      const el = document.querySelector(link.href);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        setIsMenuOpen(false);
      }
    }
  };

  return (
    <>
      <motion.nav
        variants={navStyleVariants}
        initial="top"
        animate={isScrolled ? 'scrolled' : 'top'}
        className="sticky top-0 w-full z-50 border-b border-white/5 transition-colors duration-300"
      >
        <div className="mx-auto h-20 max-w-7xl px-6 lg:px-12">
          <div className="flex h-full items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group" onClick={(e) => handleLinkClick(e, '#inicio')}>
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
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`text-sm font-bold transition-colors hover:text-[#D4A017] ${activeSection === link.href ? 'text-[#D4A017]' : 'text-white/80'
                    }`}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* CTA & Mobile Toggle */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex gap-3">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-white border-white/20 hover:bg-white/10">
                    Iniciar sesión
                  </Button>
                </Link>
                <Link href="/registro">
                  <Button variant="primary" size="sm">
                    Registrarse
                  </Button>
                </Link>
              </div>

              <button
                className="md:hidden p-2 text-white hover:text-[#D4A017] transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-y-0 right-0 z-40 w-[80%] max-w-sm bg-[#0F0A4D] border-l border-white/10 shadow-2xl md:hidden pt-24 px-6 flex flex-col overflow-y-auto pb-8"
          >
            <div className="flex flex-col gap-6 mb-12">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`text-xl font-bold transition-colors ${activeSection === link.href ? 'text-[#D4A017]' : 'text-white/90 hover:text-[#D4A017]'
                    }`}
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="flex flex-col gap-4 mt-auto mb-10 border-t border-white/10 pt-8">
              <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full text-white border-white/20 hover:bg-white/10">
                  Iniciar sesión
                </Button>
              </Link>
              <Link href="/registro" onClick={() => setIsMenuOpen(false)}>
                <Button variant="primary" className="w-full">
                  Registrarse
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drawer Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
}

