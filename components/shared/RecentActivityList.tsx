import { cn } from '@/lib/utils';
import { 
  UserPlus, 
  FileUp, 
  DollarSign, 
  RefreshCw, 
  Clock 
} from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'cliente' | 'documento' | 'pago' | 'estado';
  title: string;
  description: string;
  timestamp: string;
}

interface RecentActivityListProps {
  activities: ActivityItem[];
  loading?: boolean;
}

export default function RecentActivityList({ activities, loading = false }: RecentActivityListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4 animate-pulse">
            <div className="w-10 h-10 bg-gray-100 rounded-xl" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gray-100 rounded w-1/2" />
              <div className="h-2 bg-gray-50 rounded w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 opacity-40 italic">
        <Clock className="w-8 h-8 mb-2" />
        <p className="text-[10px] font-black uppercase tracking-widest text-center px-6">
          No hay actividad reciente para mostrar hoy.
        </p>
      </div>
    );
  }

  const icons = {
    cliente: { icon: UserPlus, color: 'text-blue-500 bg-blue-50' },
    documento: { icon: FileUp, color: 'text-[#D4A017] bg-amber-50' },
    pago: { icon: DollarSign, color: 'text-emerald-500 bg-emerald-50' },
    estado: { icon: RefreshCw, color: 'text-violet-500 bg-violet-50' },
  };

  return (
    <div className="relative">
      {/* Vertical Line */}
      <div className="absolute left-5 top-0 bottom-0 w-px bg-gray-50" />
      
      <div className="space-y-6 relative z-10">
        {activities.map((activity, idx) => {
          const { icon: Icon, color } = icons[activity.type] || icons.estado;
          
          return (
            <div key={activity.id} className="flex gap-4 group animate-reveal-right" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110", color)}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-black text-[#0F0A4D] truncate group-hover:text-[#D4A017] transition-colors">
                    {activity.title}
                  </p>
                  <span className="text-[9px] font-bold text-gray-300 uppercase whitespace-nowrap">
                    {activity.timestamp}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 font-medium line-clamp-1 leading-relaxed">
                  {activity.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
