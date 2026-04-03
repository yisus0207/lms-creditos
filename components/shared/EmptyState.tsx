'use client';

import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export default function EmptyState({
  title,
  description,
  action,
  icon,
}: EmptyStateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative flex flex-col items-center justify-center overflow-hidden rounded-3xl border border-white/20 bg-white/5 p-16 text-center backdrop-blur-xl transition-all duration-500 hover:bg-white/10"
    >
      {/* Decorative Gradient Background */}
      <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      <div className="relative mb-8 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0F0A4D] to-[#252063] shadow-2xl shadow-navy/20">
        <div className="absolute inset-0 rounded-2xl border border-white/10" />
        {icon || <Layers className="h-10 w-10 text-[#D4A017] drop-shadow-lg" />}
      </div>

      <div className="relative z-10 max-w-sm space-y-3">
        <h3 className="text-2xl font-black tracking-tight text-[#0F0A4D]">
          {title}
        </h3>
        {description && (
          <p className="text-sm font-medium leading-relaxed text-gray-500/80">
            {description}
          </p>
        )}
      </div>

      {action && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="relative mt-10"
        >
          {action}
        </motion.div>
      )}

      {/* Glass border overlay */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl border border-white/30" />
    </motion.div>
  );
}
