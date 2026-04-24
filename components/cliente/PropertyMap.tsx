'use client';

import { MapPin, Navigation, Sparkles } from 'lucide-react';
import Card from '@/components/ui/Card';

interface PropertyMapProps {
  direccion?: string;
  nombre?: string;
}

export default function PropertyMap({ direccion, nombre }: PropertyMapProps) {
  // Common fallback if no address is provided
  const query = direccion || 'Cúcuta, Norte de Santander, Colombia';
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <Card padding="none" className="overflow-hidden border border-gray-100 shadow-none hover:shadow-2xl transition-all duration-700 bg-white/40 backdrop-blur-md group h-full min-h-[300px]">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#0F0A4D] rounded-xl flex items-center justify-center text-[#D4A017] shadow-lg shadow-navy-900/20 group-hover:scale-110 transition-transform">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-[#0F0A4D] uppercase tracking-wider">Ubicación del Inmueble</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
              <Sparkles className="w-2 h-2 text-[#D4A017]" />
              Localización Satelital en Tiempo Real
            </p>
          </div>
        </div>
        {!direccion && (
          <span className="text-[9px] font-black bg-amber-50 text-amber-600 px-3 py-1 rounded-full border border-amber-100 animate-pulse">
            Sede Principal
          </span>
        )}
      </div>

      <div className="relative h-[250px] sm:h-[300px] w-full">
        {/* Decorative mask for premium feel */}
        <div className="absolute inset-0 z-10 pointer-events-none ring-1 ring-inset ring-black/5 rounded-b-[32px]" />

        <iframe
          src={embedUrl}
          className="w-full h-full border-0 absolute inset-0 grayscale-[0.2] contrast-[1.1] hover:grayscale-0 transition-all duration-1000"
          allowFullScreen
          loading="lazy"
          title="Ubicación del Inmueble"
        />

        {/* Info Overlay */}
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <div className="bg-[#0F0A4D]/90 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-2xl flex items-center justify-between transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
            <div className="flex flex-col">
              <p className="text-[9px] font-bold text-[#D4A017] uppercase tracking-widest mb-1">Dirección Registrada</p>
              <p className="text-xs font-black text-white truncate max-w-[200px]">
                {direccion || 'Avenida Principal #12-34, Cúcuta'}
              </p>
            </div>
            <button
              onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`, '_blank')}
              className="w-10 h-10 bg-white/10 hover:bg-[#D4A017] text-white rounded-xl flex items-center justify-center transition-colors"
            >
              <Navigation className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}
