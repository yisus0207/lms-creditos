// ReviewsSection.tsx
// Sección de pruebas sociales o testimonios de clientes para la Landing Page.
// Animaciones: Muestra en viewport (IntersectionObserver) con Framer Motion escalonado.
// Dependencias externas: framer-motion, lucide-react

'use client';

import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { reviews } from '@/data/reviews';
import ReviewCard from './ReviewCard';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export default function ReviewsSection() {
  return (
    <section id="testimonios" className="bg-white py-32 px-6 relative overflow-hidden">
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

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          {reviews.map((t) => (
            <ReviewCard key={t.id} review={t} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
