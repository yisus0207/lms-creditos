import { cn } from '@/lib/utils';
import { 
  Search, 
  FileText, 
  Building2, 
  CheckCircle2, 
  XCircle,
  ArrowRight
} from 'lucide-react';

interface FunnelStep {
  name: string;
  count: number;
  key: string;
  icon: any;
  color: string;
}

interface ProcessFunnelProps {
  data: {
    viabilidad: number;
    documentos: number;
    banco: number;
    aprobado: number;
    rechazado: number;
  };
}

export default function ProcessFunnel({ data }: ProcessFunnelProps) {
  const steps: FunnelStep[] = [
    { name: 'Viabilidad', key: 'viabilidad', count: data.viabilidad, icon: Search, color: 'bg-amber-500' },
    { name: 'Documentos', key: 'documentos', count: data.documentos, icon: FileText, color: 'bg-navy-700' },
    { name: 'En Banco', key: 'banco', count: data.banco, icon: Building2, color: 'bg-emerald-500' },
    { name: 'Aprobado', key: 'aprobado', count: data.aprobado, icon: CheckCircle2, color: 'bg-violet-500' },
  ];

  const total = Object.values(data).reduce((acc, curr) => acc + curr, 0) || 1;

  return (
    <div className="w-full py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
        {steps.map((step, idx) => {
          const percentage = Math.round((step.count / total) * 100);
          const Icon = step.icon;
          
          return (
            <div key={step.key} className="relative group">
              <div className="bg-white p-5 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className={cn("p-2 rounded-xl text-white shadow-sm", step.color)}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Paso {idx + 1}</span>
                </div>
                
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{step.name}</h4>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-[#0F0A4D] tracking-tighter">{step.count}</span>
                  <span className="text-[10px] font-bold text-gray-400">clientes</span>
                </div>

                <div className="mt-4 w-full h-1.5 bg-gray-50 rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full rounded-full transition-all duration-1000 ease-out", step.color)}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <p className="mt-2 text-[9px] font-black text-gray-400 uppercase tracking-tighter">
                  {percentage}% del total acumulado
                </p>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden lg:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-4 h-4 bg-white rounded-full border border-gray-100 items-center justify-center shadow-sm">
                  <ArrowRight className="w-2.5 h-2.5 text-gray-300" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {data.rechazado > 0 && (
        <div className="mt-6 p-4 bg-rose-50 rounded-2xl border border-rose-100 flex items-center justify-between animate-reveal-up">
          <div className="flex items-center gap-3">
            <XCircle className="w-5 h-5 text-rose-500" />
            <span className="text-xs font-black text-rose-700 uppercase tracking-widest">Créditos Rechazados</span>
          </div>
          <span className="text-xl font-black text-rose-700 leading-none">{data.rechazado}</span>
        </div>
      )}
    </div>
  );
}
