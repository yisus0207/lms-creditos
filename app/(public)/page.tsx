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
      {/* Hero Overhaul */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#0F0A4D]">
        {/* Luxury Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero-bg.jpg" 
            alt="Fondo LMS" 
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F0A4D] via-[#0F0A4D]/80 to-[#FDFDFD]" />
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(212,160,23,0.15),transparent)]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 animate-in slide-in-from-top duration-700">
            <Award className="w-4 h-4 text-[#D4A017]" />
            <span className="text-[10px] font-black text-white/60 tracking-[0.2em] uppercase">Gestión Hipotecaria Elite</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-black text-white leading-[1.05] tracking-tighter mb-8 max-w-4xl animate-in zoom-in-95 duration-1000">
            Tu hogar merece un crédito <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4A017] via-[#efac1d] to-[#D4A017] drop-shadow-sm">
              sin complicaciones.
            </span>
          </h1>

          <p className="max-w-2xl text-lg sm:text-xl text-white/50 mb-12 font-medium leading-relaxed">
            Expertos en gestión hipotecaria. Llevamos tu sueño desde la viabilidad hasta la entrega de llaves, con transparencia absoluta.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6 mb-20">
            <Link href="/contacto">
              <Button size="lg" className="h-16 px-10 rounded-2xl bg-[#D4A017] text-[#0F0A4D] font-black text-lg shadow-2xl shadow-amber-900/40 hover:scale-105 active:scale-95 transition-all whitespace-nowrap flex-nowrap">
                Iniciar Mi Trámite
                <Zap className="w-5 h-5 ml-2 shrink-0" />
              </Button>
            </Link>
            <Link href="#servicios">
              <Button variant="ghost" className="h-16 px-10 border-white/10 text-white hover:bg-white/5 whitespace-nowrap flex-nowrap">
                Descubrir Proceso
              </Button>
            </Link>
          </div>

          {/* Trust Badges: Bancos Aliados */}
          <div className="w-full pt-12 border-t border-white/5">
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-10 text-center">Respaldados por la banca líder</p>
            <div className="flex flex-wrap justify-center items-center gap-10 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
              {['Bancolombia', 'Davivienda', 'BBVA', 'Banco de Bogotá', 'Scotiabank'].map(banco => (
                <span key={banco} className="text-xl font-black text-white italic tracking-tighter uppercase">{banco}</span>
              ))}
            </div>
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
