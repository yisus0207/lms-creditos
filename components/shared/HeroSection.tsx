'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Zap, ShieldCheck, CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/Button';

// HeroSection.tsx
// Componente de encabezado de la Landing Page.
// Animaciones: Efecto cámara aérea (zoom-in suave) para la imagen de fondo, entrada escalonada (stagger) para el contenido y el glassmorphism.
// Dependencias externas: framer-motion, lucide-react

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.4,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 20 }
  },
};

export default function HeroSection() {
  return (
    <section id="inicio" className="relative flex items-center overflow-hidden bg-[#060318]" style={{ minHeight: 'calc(100vh - 120px)' }}>

      {/* Background with Camera Animation */}
      <motion.div
        className="absolute inset-0 z-0 origin-top"
        initial={{ scale: 1.4, y: -60, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ duration: 2.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("/images/hero-bg.jpg")' }}
        />
        {/* Overlay Dark/Navy para asegurar legibilidad */}
        <div className="absolute inset-0 bg-[#0F0A4D]/80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#060318]/90 via-[#060318]/50 to-[#060318] pointer-events-none" />
      </motion.div>

      {/* Orbes de luz (Conservados de la versión original para mantener la estética) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-[#D4A017]/10 blur-[180px]" />
        <div className="absolute top-1/2 -translate-y-1/2 left-[-150px] w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[160px]" />
      </div>

      {/* Contenido Principal */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 py-32 lg:py-16 grid lg:grid-cols-2 gap-16 lg:gap-8 items-center"
      >

        {/* Columna Izquierda: Texto */}
        <div className="flex flex-col items-start pt-20 lg:pt-0">
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#D4A017]/30 bg-[#D4A017]/10 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#D4A017] animate-pulse" />
            <span className="text-[11px] font-black text-[#D4A017] tracking-[0.25em] uppercase">Gestión Hipotecaria · Colombia</span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl xl:text-7xl font-black text-white leading-[1.0] tracking-tighter mb-6">
            Tu hogar<br />merece un<br />crédito{' '}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4A017] via-[#f0c040] to-[#D4A017]">
                real.
              </span>
              <span className="absolute -bottom-1 left-0 w-full h-[3px] bg-gradient-to-r from-[#D4A017] to-transparent rounded-full" />
            </span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-lg text-white/60 font-medium leading-relaxed mb-10 max-w-lg">
            Desde el estudio de viabilidad hasta la entrega de llaves. Expertos en hacer realidad el sueño de tu hogar, con cero complicaciones.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-14 w-full sm:w-auto">
            <Link href="/contacto" className="w-full sm:w-auto">
              <Button size="lg" variant="primary" className="w-full sm:w-auto shadow-[0_0_40px_rgba(212,160,23,0.3)]">
                Iniciar Mi Trámite
                <Zap className="w-4 h-4 ml-2 group-hover:rotate-12 transition-transform" />
              </Button>
            </Link>
            <Link href="#servicios" className="w-full sm:w-auto">
              <Button size="lg" variant="ghost" className="w-full sm:w-auto text-white border-white/20 hover:bg-white/10 hover:text-white">
                Ver cómo funciona →
              </Button>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-8">
            {[
              { value: '+500', label: 'Familias atendidas' },
              { value: '98%', label: 'Tasa de aprobación' },
              { value: '72h', label: 'Respuesta express' },
            ].map((s, i) => (
              <div key={i} className="flex flex-col">
                <span className="text-2xl font-black text-white">{s.value}</span>
                <span className="text-xs text-white/40 font-medium mt-0.5">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Columna Derecha: Card Visual */}
        <motion.div variants={itemVariants} className="relative flex items-center justify-center">
          <div className="absolute w-[420px] h-[420px] rounded-full bg-[#D4A017]/10 blur-[100px]" />

          {/* Main Glassmorphism Card */}
          <div className="relative w-full max-w-sm bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 shadow-[0_32px_80px_rgba(0,0,0,0.6)]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs text-white/40 font-bold uppercase tracking-widest mb-1">Gestión Activa</p>
                <p className="text-lg font-black text-white">Crédito Hipotecario</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#D4A017]/20 flex items-center justify-center border border-[#D4A017]/20">
                <ShieldCheck className="w-6 h-6 text-[#D4A017]" />
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between text-xs text-white/40 font-bold uppercase tracking-wider mb-2">
                <span>Progreso del trámite</span>
                <span className="text-[#D4A017]">73%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-[73%] bg-gradient-to-r from-[#D4A017] to-[#f0c040] rounded-full shadow-[0_0_12px_rgba(212,160,23,0.6)]" />
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {[
                { label: 'Estudio de viabilidad', done: true },
                { label: 'Documentación bancaria', done: true },
                { label: 'Aprobación del crédito', done: true },
                { label: 'Firma en notaría', done: false },
                { label: 'Entrega de llaves', done: false },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${step.done ? 'bg-[#D4A017]/20 border border-[#D4A017]/40' : 'bg-white/5 border border-white/10'}`}>
                    {step.done && <CheckCircle2 className="w-3 h-3 text-[#D4A017]" />}
                  </div>
                  <span className={`text-sm font-semibold ${step.done ? 'text-white/80' : 'text-white/25'}`}>{step.label}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="flex -space-x-2">
                {['M', 'C', 'E'].map((l, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4A017] to-blue-600 flex items-center justify-center border-2 border-[#060318] text-[10px] font-black text-white">
                    {l}
                  </div>
                ))}
              </div>
              <span className="text-xs text-white/40 font-medium">+500 clientes activos</span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="absolute -top-4 -right-4 lg:right-0 bg-gradient-to-br from-[#D4A017] to-[#c49010] p-[1px] rounded-2xl shadow-[0_8px_32px_rgba(212,160,23,0.4)]"
          >
            <div className="bg-[#0e0825] rounded-2xl px-4 py-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#D4A017]" />
              <div>
                <p className="text-[9px] font-black text-white/40 uppercase tracking-widest leading-none mb-0.5">Promoción activa</p>
                <p className="text-sm font-black text-white">Escrituras GRATIS</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.4 }}
            className="absolute -bottom-4 -left-4 lg:left-0 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-2 shadow-xl"
          >
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm font-bold text-white/80">Asesores disponibles hoy</span>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Trust Bar Bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-white/5 bg-white/[0.02] backdrop-blur-sm px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-10 gap-y-2">
          {['Banco Davivienda', 'Bancolombia', 'Banco de Bogotá', 'BBVA Colombia', 'Banco Av Villas'].map((bank, i) => (
            <span key={i} className="text-xs font-black text-white/20 uppercase tracking-widest whitespace-nowrap">{bank}</span>
          ))}
        </div>
      </div>

    </section>
  );
}
