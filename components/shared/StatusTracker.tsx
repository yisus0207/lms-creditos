import { motion } from 'framer-motion';
import { Check, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  label: string;
  key: string;
}

interface StatusTrackerProps {
  currentStep: string;
}

const steps: Step[] = [
  { label: 'Viabilidad', key: 'viabilidad' },
  { label: 'Documentos', key: 'documentos' },
  { label: 'En Banco', key: 'banco' },
  { label: 'Aprobado', key: 'aprobado' },
];

export default function StatusTracker({ currentStep }: StatusTrackerProps) {
  const currentIdx = steps.findIndex(s => s.key === currentStep);

  return (
    <div className="relative w-full max-w-4xl mx-auto py-12 sm:py-20 px-4">
      {/* Background Track (Liquid Glow Path) */}
      <div className="absolute top-[52px] sm:top-[72px] left-[10%] right-[10%] h-[2px] flex justify-between items-center px-2 opacity-20 pointer-events-none">
        {[...Array(24)].map((_, i) => (
          <div 
            key={i} 
            className="w-1 h-1 rounded-full bg-gray-400" 
          />
        ))}
      </div>

      {/* Progress Line (Central Path) */}
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `calc(${(currentIdx / (steps.length - 1)) * 80}% )` }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="absolute top-[52px] sm:top-[72px] left-[10%] h-[2px] bg-gradient-to-r from-[#0F0A4D] via-[#D4A017] to-amber-200 shadow-[0_0_20px_rgba(212,160,23,0.8)] z-0"
      />
      
      <div className="relative flex items-center justify-between w-full">
        {steps.map((step, index) => {
          const isCompleted = index < currentIdx;
          const isCurrent = index === currentIdx;
          const isFuture = index > currentIdx;

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center">
              {/* Premium Crystal Node */}
              <div className="relative mb-4 sm:mb-8">
                {isCurrent && (
                  <motion.div 
                    animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.1, 0.4] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute inset-[-12px] sm:inset-[-20px] rounded-full bg-[#D4A017]/20 blur-xl"
                  />
                )}
                
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className={cn(
                    "w-10 h-10 sm:w-16 sm:h-16 rounded-[18px] sm:rounded-[26px] flex items-center justify-center transition-all duration-700 border relative backdrop-blur-md overflow-hidden",
                    isCompleted 
                      ? 'bg-gradient-to-br from-[#0F0A4D] to-[#1A1560] border-transparent text-white shadow-xl shadow-[#0F0A4D]/20' 
                      : isCurrent
                        ? 'bg-white border-[#D4A017] text-[#D4A017] shadow-2xl shadow-[#D4A017]/30 scale-110 sm:scale-125 z-20'
                        : 'bg-white/40 border-gray-100 text-gray-300 backdrop-blur-sm'
                  )}
                >
                  {/* Glass Shine */}
                  <div className="absolute top-0 left-0 w-full h-[40%] bg-white/10 -skew-y-12 translate-y-[-50%]" />

                  {isCompleted ? (
                    <Check className="w-5 h-5 sm:w-8 sm:h-8 stroke-[3.5] drop-shadow-md" />
                  ) : isCurrent ? (
                    <div className="w-3 h-3 sm:w-5 sm:h-5 rounded-full bg-[#D4A017] shadow-[0_0_15px_#D4A017] animate-pulse" />
                  ) : (
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gray-200" />
                  )}
                </motion.div>
              </div>

              {/* Sophisticated Label */}
              <div className="flex flex-col items-center gap-1.5 transition-all duration-500">
                <span 
                  className={cn(
                    "text-[8px] sm:text-[11px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] transition-all duration-500 px-2 rounded-full",
                    isCurrent ? 'text-[#D4A017] bg-[#D4A017]/5' : isCompleted ? 'text-[#0F0A4D]' : 'text-gray-300'
                  )}
                >
                  {step.label}
                </span>
                
                {/* Active Indicator Underline */}
                {isCurrent && (
                  <motion.div 
                    layoutId="underline"
                    className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#D4A017] to-transparent rounded-full opacity-60"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
