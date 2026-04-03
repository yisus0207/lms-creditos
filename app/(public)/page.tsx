'use client';

import Button from '@/components/ui/Button';
import Link from 'next/link';
import {
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Clock,
  TrendingUp,
  Award,
  Users
} from 'lucide-react';

export default function LandingPage() {
  return (
    <>
      {/* ===== HERO: ULTRA PREMIUM ===== */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-[#060318]">
        
        {/* === FONDO MULTI-CAPA === */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Ruido suave de textura */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }} />
          {/* Grid líneas */}
          <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
          {/* Orb 1: dorado centro-arriba */}
          <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-[#D4A017]/10 blur-[180px]" />
          {/* Orb 2: azul centro-izquierda */}
          <div className="absolute top-1/2 -translate-y-1/2 left-[-150px] w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[160px]" />
          {/* Orb 3: violeta derecha */}
          <div className="absolute bottom-0 right-[-100px] w-[500px] h-[500px] rounded-full bg-purple-700/10 blur-[140px]" />
        </div>

        {/* === CONTENIDO PRINCIPAL: SPLIT LAYOUT === */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 py-24 lg:py-0 grid lg:grid-cols-2 gap-16 lg:gap-8 items-center min-h-screen">
          
          {/* ---------- COLUMNA IZQUIERDA: TEXTO ---------- */}
          <div className="flex flex-col items-start">
            {/* Badge Elite */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#D4A017]/30 bg-[#D4A017]/10 mb-8">
              <span className="w-2 h-2 rounded-full bg-[#D4A017] animate-pulse" />
              <span className="text-[11px] font-black text-[#D4A017] tracking-[0.25em] uppercase">Gestión Hipotecaria · Colombia</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl xl:text-7xl font-black text-white leading-[1.0] tracking-tighter mb-6">
              Tu hogar<br />
              merece un<br />
              crédito{' '}
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4A017] via-[#f0c040] to-[#D4A017]">
                  real.
                </span>
                {/* Línea subrayado dorada */}
                <span className="absolute -bottom-1 left-0 w-full h-[3px] bg-gradient-to-r from-[#D4A017] to-transparent rounded-full" />
              </span>
            </h1>

            <p className="text-lg text-white/40 font-medium leading-relaxed mb-10 max-w-lg">
              Desde el estudio de viabilidad hasta la entrega de llaves. Expertos en hacer realidad el sueño de tu hogar, con cero complicaciones.
            </p>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row items-start gap-4 mb-14">
              <Link href="/contacto">
                <button className="group relative h-14 px-8 rounded-2xl bg-[#D4A017] text-[#060318] font-black text-base overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(212,160,23,0.3)]">
                  <span className="relative z-10 flex items-center gap-2">
                    Iniciar Mi Trámite
                    <Zap className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#f0c040] to-[#D4A017] opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </Link>
              <Link href="#servicios">
                <button className="h-14 px-8 rounded-2xl border border-white/10 text-white/70 text-base font-semibold hover:bg-white/5 hover:text-white hover:border-white/20 transition-all">
                  Ver cómo funciona →
                </button>
              </Link>
            </div>

            {/* Trust Stats */}
            <div className="flex flex-wrap gap-8">
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
            </div>
          </div>

          {/* ---------- COLUMNA DERECHA: CARD VISUAL ---------- */}
          <div className="relative flex items-center justify-center">
            {/* Halo detrás de la card */}
            <div className="absolute w-[420px] h-[420px] rounded-full bg-[#D4A017]/10 blur-[100px]" />
            
            {/* Card Principal tipo Glassmorphism */}
            <div className="relative w-full max-w-sm bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 shadow-[0_32px_80px_rgba(0,0,0,0.6)]">
              
              {/* Header de la card */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs text-white/40 font-bold uppercase tracking-widest mb-1">Gestión Activa</p>
                  <p className="text-lg font-black text-white">Crédito Hipotecario</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#D4A017]/20 flex items-center justify-center border border-[#D4A017]/20">
                  <ShieldCheck className="w-6 h-6 text-[#D4A017]" />
                </div>
              </div>

              {/* Barra de Progreso */}
              <div className="mb-6">
                <div className="flex justify-between text-xs text-white/40 font-bold uppercase tracking-wider mb-2">
                  <span>Progreso del trámite</span>
                  <span className="text-[#D4A017]">73%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-[73%] bg-gradient-to-r from-[#D4A017] to-[#f0c040] rounded-full shadow-[0_0_12px_rgba(212,160,23,0.6)]" />
                </div>
              </div>

              {/* Pasos del proceso */}
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

              {/* Footer de la card */}
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

            {/* Floating Badge: Escrituras Gratis */}
            <div className="absolute -top-4 -right-4 lg:right-0 bg-gradient-to-br from-[#D4A017] to-[#c49010] p-[1px] rounded-2xl shadow-[0_8px_32px_rgba(212,160,23,0.4)]">
              <div className="bg-[#0e0825] rounded-2xl px-4 py-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#D4A017]" />
                <div>
                  <p className="text-[9px] font-black text-white/40 uppercase tracking-widest leading-none mb-0.5">Promoción activa</p>
                  <p className="text-sm font-black text-white">Escrituras GRATIS</p>
                </div>
              </div>
            </div>

            {/* Floating Badge: Respuesta rápida */}
            <div className="absolute -bottom-4 -left-4 lg:left-0 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-2 shadow-xl">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm font-bold text-white/80">Asesores disponibles ahora</span>
            </div>
          </div>

        </div>

        {/* === BARRA INFERIOR DE CONFIANZA === */}
        <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-white/5 bg-white/[0.02] backdrop-blur-sm px-6 py-4">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-10 gap-y-2">
            {['Banco Davivienda', 'Bancolombia', 'Banco de Bogotá', 'BBVA Colombia', 'Banco Av Villas'].map((bank, i) => (
              <span key={i} className="text-xs font-black text-white/20 uppercase tracking-widest whitespace-nowrap">{bank}</span>
            ))}
          </div>
        </div>

      </section>

      {/* Promo Highlight: Escrituras Gratis */}
      <section className="bg-white py-24 px-6 overflow-hidden relative">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center gap-2 bg-rose-50 px-4 py-2 rounded-xl border border-rose-100">
              <Clock className="w-5 h-5 text-rose-500 animate-bounce" />
              <span className="text-rose-600 font-black text-xs uppercase tracking-wider italic">¡Últimos 4 cupos disponibles!</span>
            </div>

            <h2 className="text-4xl sm:text-6xl font-black text-[#0F0A4D] leading-tight">
              Nosotros pagamos <br /> tus
              <span className="text-[#D4A017] relative">
                {" escrituras*"}
                <span className="absolute bottom-2 left-0 w-full h-3 bg-[#D4A017]/10 -z-10 rotate-[-1deg]" />
              </span>
            </h2>

            <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-lg">
              Por ser el mes de aniversario, asumimos el costo notarial de tu trámite. No pagas los <span className="line-through decoration-rose-500 decoration-2 font-black italic">$1.800.000</span> habituales. <span className="text-[#0F0A4D] font-black">Es nuestra cortesía.</span>
            </p>

            <div className="flex items-center gap-4">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
              <span className="font-bold text-[#0F0A4D]">Válido para radicaciones este mes</span>
            </div>

            <Button size="lg" className="rounded-2xl px-8 shadow-xl shadow-amber-100 whitespace-nowrap flex-nowrap">
              Asegurar Mi Cupo
              <ArrowRight className="w-5 h-5 ml-2 shrink-0" />
            </Button>
          </div>

          <div className="flex-1 w-full relative">
            <div className="aspect-square bg-gradient-to-br from-gray-50 to-white border-2 border-[#D4A017]/10 rounded-[64px] relative overflow-hidden flex items-center justify-center p-12">
              <div className="text-center space-y-6">
                <div className="w-32 h-32 bg-[#D4A017]/10 rounded-[40px] flex items-center justify-center text-[#D4A017] mx-auto mb-6 rotate-12">
                  <ShieldCheck className="w-16 h-16" />
                </div>
                <div className="text-6xl font-black text-[#0F0A4D] tracking-tighter italic animate-pulse">GRATIS</div>
                <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">Ahorro Inmediato</div>
              </div>
              {/* Decorative dots */}
              <div className="absolute top-10 right-10 w-20 h-20 border-2 border-dashed border-[#D4A017]/20 rounded-full" />
              <div className="absolute bottom-10 left-10 w-10 h-10 bg-[#D4A017] rounded-full opacity-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Features Section */}
      <section id="servicios" className="bg-gray-50 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <p className="text-[10px] font-black text-[#D4A017] uppercase tracking-[0.4em] mb-4">Metodología LMS</p>
            <h2 className="text-4xl sm:text-5xl font-black text-[#0F0A4D]">Por qué somos diferentes</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: Zap,
                title: 'Estudio Express',
                desc: 'Análisis de viabilidad en menos de 24 horas. Sabemos que el tiempo es oro.',
                color: 'text-amber-500'
              },
              {
                icon: ShieldCheck,
                title: 'Transparencia Total',
                desc: 'Sin costos ocultos ni sorpresas. Sabes exactamente qué pagas desde el día 1.',
                color: 'text-blue-500'
              },
              {
                icon: TrendingUp,
                title: 'Garantía de Aprobación',
                desc: 'Ajustamos tu perfil para maximizar las probabilidades con cada banco.',
                color: 'text-green-500'
              }
            ].map((feature, i) => (
              <div
                key={i}
                className="group bg-white p-12 rounded-[48px] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 hover:-translate-y-2 transition-all duration-500"
              >
                <div className={`w-16 h-16 rounded-3xl bg-gray-50 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform ${feature.color}`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-[#0F0A4D] mb-4">{feature.title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section: Power Social Proof */}
      <section className="bg-white py-32 px-6 relative overflow-hidden">
        {/* Subtle decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-100 mb-4">
              <CheckCircle2 className="w-3 h-3 text-[#D4A017]" />
              <span className="text-[10px] font-black text-[#D4A017] uppercase tracking-[0.2em]">Más de 500 familias</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-[#0F0A4D] tracking-tighter">
              Historias que inspiran confianza
            </h2>
            <p className="mt-6 text-gray-500 font-medium max-w-2xl mx-auto">
              Nuestra mayor recompensa es ver a nuestros clientes recibir las llaves de su nuevo hogar. Aquí algunos de sus testimonios.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                name: 'Marisol G.',
                role: 'Propiedad en Bogotá',
                img: '/images/testimonials/marisol.png',
                text: 'Logramos comprar nuestro apartamento en tiempo récord. El equipo de LMS se encargó de toda la burocracia bancaria. ¡Increíble!',
                stars: 5
              },
              {
                name: 'Carlos R.',
                role: 'Inversión Inmobiliaria',
                img: '/images/testimonials/carlos.png',
                text: 'La transparencia fue total. Me ahorré más de $1.8M en escrituras gracias a su promoción. Realmente cumplen lo que prometen.',
                stars: 5
              },
              {
                name: 'Elena V.',
                role: 'Primer Hogar',
                img: '/images/testimonials/elena.png',
                text: 'Como madre soltera, pensé que el crédito sería imposible. LMS ajustó mi perfil y hoy ya tengo mi casa propia. Gratitud eterna.',
                stars: 5
              }
            ].map((t, i) => (
              <div
                key={i}
                className="group relative bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-[#D4A017]/10 hover:-translate-y-2 transition-all duration-500 flex flex-col items-center text-center"
              >
                {/* Avatar with luxury border */}
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-[#D4A017] rounded-full blur-[10px] opacity-0 group-hover:opacity-40 transition-opacity" />
                  <div className="relative w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden">
                    {/* fallback to initials if image doesn't load */}
                    <img
                      src={t.img}
                      alt={t.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${t.name}&background=0B1E3F&color=fff`;
                      }}
                    />
                  </div>
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(t.stars)].map((_, i) => (
                    <Award key={i} className="w-4 h-4 text-[#D4A017] fill-[#D4A017]" />
                  ))}
                </div>

                <p className="text-gray-600 font-medium leading-relaxed italic mb-8">
                  "{t.text}"
                </p>

                <div className="mt-auto">
                  <h4 className="text-lg font-black text-[#0F0A4D] tracking-tight">{t.name}</h4>
                  <p className="text-xs font-bold text-[#D4A017] uppercase tracking-widest mt-1">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action: Final Sprint */}
      <section className="bg-[#0F0A4D] py-32 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,160,23,0.1),transparent)]" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <Users className="w-16 h-16 text-[#D4A017] mx-auto mb-8 opacity-50" />
          <h2 className="text-4xl sm:text-6xl font-black text-white mb-8">Únete a cientos de familias felices</h2>
          <p className="text-xl text-white/50 mb-12 italic font-medium">
            "Simplificamos lo complejo para que tú solo te preocupes por la decoración."
          </p>
          <Link href="/contacto">
            <Button size="lg" className="h-16 px-12 rounded-2xl bg-white text-[#0F0A4D] font-black hover:bg-[#D4A017] hover:text-[#0F0A4D] transition-all whitespace-nowrap flex-nowrap">
              Agendar Asesoría Gratuita
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
