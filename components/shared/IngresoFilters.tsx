import React from 'react';
import { Search } from 'lucide-react';

interface IngresoFiltersProps {
  onSearch: (term: string) => void;
  onTypeChange: (type: string) => void;
  onStatusChange: (status: string) => void;
}

export default function IngresoFilters({ onSearch, onTypeChange, onStatusChange }: IngresoFiltersProps) {
  return (
    <div className="bg-white rounded-[32px] p-8 border border-gray-100/50 shadow-sm flex flex-col md:flex-row gap-4 items-center">
      <div className="relative flex-1 w-full text-gray-400">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Buscar por cliente..."
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-16 pr-6 py-4 bg-gray-50/50 border-none rounded-2xl text-sm font-medium text-[#0F0A4D] focus:ring-2 focus:ring-gold/20 transition-all placeholder:text-gray-400"
        />
      </div>
      
      <div className="flex gap-4 w-full md:w-auto">
        <select 
          onChange={(e) => onTypeChange(e.target.value)}
          className="px-6 py-4 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-[#0F0A4D] focus:ring-0 cursor-pointer"
        >
          <option value="">Todos los tipos</option>
          <option value="viabilidad">Viabilidad</option>
          <option value="documentos">Documentos</option>
          <option value="comision">Comisión</option>
        </select>

        <select 
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-6 py-4 bg-white border border-[#D4A017] rounded-2xl text-sm font-bold text-[#D4A017] focus:ring-0 cursor-pointer"
        >
          <option value="">Todos los estados</option>
          <option value="pagado">Pagado</option>
          <option value="pendiente">Pendiente</option>
        </select>
      </div>
    </div>
  );
}
