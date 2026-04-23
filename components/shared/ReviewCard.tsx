// ReviewCard.tsx
// Componente hijo para presentar cada reseña en forma de Card.
// Animaciones: Utiliza motion.div para recibir variantes de entrada desde el padre (stagger).
// Dependencias externas: framer-motion, lucide-react

'use client';

import { motion } from 'framer-motion';
import { Award } from 'lucide-react';
import type { Review } from '@/data/reviews';

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { type: 'spring', stiffness: 120, damping: 20 }
  }
};

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <motion.div
      variants={cardVariants}
      className="group relative bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-[#D4A017]/10 md:hover:-translate-y-2 transition-all duration-500 flex flex-col items-center text-center"
    >
      {/* Avatar with luxury border */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-[#D4A017] rounded-full blur-[10px] opacity-0 group-hover:opacity-40 transition-opacity" />
        <div className="relative w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden">
          {/* fallback to initials if image doesn't load */}
          <img
            src={review.img}
            alt={review.name}
            loading="lazy"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.name)}&background=0B1E3F&color=fff`;
            }}
          />
        </div>
      </div>

      {/* Stars */}
      <div className="flex gap-1 mb-6">
        {[...Array(review.stars)].map((_, i) => (
          <Award key={i} className="w-4 h-4 text-[#D4A017] fill-[#D4A017]" />
        ))}
      </div>

      <p className="text-gray-600 font-medium leading-relaxed italic mb-8">
        "{review.text}"
      </p>

      <div className="mt-auto">
        <h4 className="text-lg font-black text-[#0F0A4D] tracking-tight">{review.name}</h4>
        <p className="text-xs font-bold text-[#D4A017] uppercase tracking-widest mt-1">{review.role}</p>
      </div>
    </motion.div>
  );
}
