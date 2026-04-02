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
    <div className="relative flex items-center justify-between w-full py-12">
      {/* Background Line */}
      <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-100 -translate-y-[22px]" />
      
      {/* Active Line Gradient */}
      <div 
        className="absolute top-1/2 left-0 h-[2px] bg-gradient-to-r from-[#D4A017] to-[#0F0A4D] -translate-y-[22px] transition-all duration-1000 ease-out"
        style={{ width: `${(currentIdx / (steps.length - 1)) * 100}%` }}
      />

      {steps.map((step, index) => {
        const isCompleted = index < currentIdx;
        const isCurrent = index === currentIdx;
        const isFuture = index > currentIdx;

        return (
          <div key={step.key} className="relative z-10 flex flex-col items-center flex-1">
            {/* Step Circle */}
            <div 
              className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-700 border-2 relative",
                isCompleted 
                  ? 'bg-[#0F0A4D] border-[#0F0A4D] text-white shadow-lg shadow-navy-100' 
                  : isCurrent
                    ? 'bg-white border-[#D4A017] text-[#D4A017] shadow-2xl shadow-amber-200 animate-glow-gold scale-125 z-20'
                    : 'bg-white border-gray-100 text-gray-300'
              )}
            >
              {isCompleted ? (
                <Check className="w-6 h-6 stroke-[3]" />
              ) : isCurrent ? (
                <div className="relative flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-[#D4A017] animate-ping absolute opacity-70" />
                  <div className="w-3 h-3 rounded-full bg-[#D4A017] relative z-10" />
                </div>
              ) : (
                <Circle className="w-4 h-4 fill-gray-50/50" />
              )}
            </div>

            {/* Label */}
            <div className={cn(
              "absolute top-14 text-center w-full transition-all duration-500",
              isCurrent && "animate-floating"
            )}>
              <span 
                className={cn(
                  "text-[10px] sm:text-[11px] font-black uppercase tracking-[0.25em] transition-colors duration-500",
                  isCurrent ? 'text-[#D4A017] drop-shadow-sm' : isCompleted ? 'text-[#0F0A4D]' : 'text-gray-400'
                )}
              >
                {step.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
