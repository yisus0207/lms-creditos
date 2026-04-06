'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthHandler() {
  const router = useRouter();

  useEffect(() => {
    // 1. Revisión manual inmediata (por si Supabase limpia la URL antes del evento)
    const hash = window.location.hash;
    if (hash.includes('type=invite') || hash.includes('type=recovery')) {
      console.log("¡Invitación detectada en la URL! Redirigiendo...");
      router.push('/login/reset-password');
      return;
    }

    // 2. Escucha de eventos oficiales
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Evento Auth detectado:", event);
      if (event === 'PASSWORD_RECOVERY') {
        router.push('/login/reset-password');
      }
      
      // Caso especial: si ya inició sesión pero viene de un link de invitación
      if (event === 'SIGNED_IN' && window.location.hash.includes('type=invite')) {
        router.push('/login/reset-password');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return null;
}
