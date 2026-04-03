'use client';

import { useState, useEffect } from 'react';
import { APP_NAME } from '@/constants';
import { User, LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ClientPortalHeader() {
  const [name, setName] = useState<string>('Perfil Cliente');

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.full_name) {
        // Formato: Primer Nombre y Primer Apellido
        const parts = user.user_metadata.full_name.split(' ');
        const displayName = parts.length >= 2 
          ? `${parts[0]} ${parts[parts.length - 1]}`
          : parts[0];
        setName(displayName);
      }
    }
    loadUser();
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm shadow-navy-900/5">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#0F0A4D] rounded-xl flex items-center justify-center shadow-lg shadow-navy-100">
            <span className="text-white font-black text-xl">L</span>
          </div>
          <span className="text-xl font-black text-[#0F0A4D] tracking-tighter">
            {APP_NAME} <span className="text-[#D4A017] font-medium ml-1">Mi Portal</span>
          </span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="w-8 h-8 rounded-full bg-[#D4A017]/10 flex items-center justify-center">
              <User className="w-4 h-4 text-[#D4A017]" />
            </div>
            <span className="text-xs font-black text-[#0F0A4D] uppercase tracking-wider">{name}</span>
          </div>
          
          <button
            type="button"
            onClick={() => supabase.auth.signOut().then(() => window.location.href = '/login')}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors group"
            title="Cerrar sesión"
          >
            <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </header>
  );
}
