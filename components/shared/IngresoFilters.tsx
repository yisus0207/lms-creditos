import { Search } from 'lucide-react';
import Select from '@/components/ui/Select';
import { useState } from 'react';

interface IngresoFiltersProps {
  onSearch: (term: string) => void;
  onTypeChange: (type: string) => void;
  onStatusChange: (status: string) => void;
}

export default function IngresoFilters({ onSearch, onTypeChange, onStatusChange }: IngresoFiltersProps) {
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-center w-full">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
        <input 
          type="text" 
          placeholder="Buscar por cliente o expediente..."
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-16 pr-6 h-14 bg-gray-50/50 border-none rounded-2xl text-sm font-medium text-[#0F0A4D] focus:ring-2 focus:ring-[#D4A017]/20 transition-all placeholder:text-gray-400"
        />
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto min-w-[400px]">
        <Select 
          className="flex-1"
          placeholder="Todos los tipos"
          options={[
            { id: '', label: 'Todos los tipos' },
            { id: 'viabilidad', label: 'Viabilidad' },
            { id: 'documentos', label: 'Documentos' },
            { id: 'comision', label: 'Comisión' }
          ]}
          value={type}
          onChange={(val) => {
            setType(val);
            onTypeChange(val);
          }}
        />

        <Select 
          className="flex-1"
          placeholder="Todos los estados"
          options={[
            { id: '', label: 'Todos los estados' },
            { id: 'pagado', label: 'Pagado' },
            { id: 'pendiente', label: 'Pendiente' }
          ]}
          value={status}
          onChange={(val) => {
            setStatus(val);
            onStatusChange(val);
          }}
        />
      </div>
    </div>
  );
}
