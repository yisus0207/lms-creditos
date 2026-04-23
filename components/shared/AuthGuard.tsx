'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ShieldCheck } from 'lucide-react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }

      // SECURITY CHECK: Verify if the user has access to the admin area
      const user = session.user;
      const isAdmin = user.email?.endsWith('@lmscreditos.com');

      if (!isAdmin) {
        // If it's a client attempting to access /dashboard, send them to portal
        const { data: client } = await supabase
          .from('clientes')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (client) {
          router.push('/portal');
        } else {
          // Zombie user (Auth exists but no record in DB): Kick out
          await supabase.auth.signOut();
          router.push('/login');
        }
        return;
      }
      
      setAuthenticated(true);
      setLoading(false);
    };

    checkAuth();

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session) {
        router.push('/login');
      } else {
        const isAdmin = session.user.email?.endsWith('@lmscreditos.com');
        if (!isAdmin) {
          // If a client or unauthorized user is detected, they shouldn't be here
          router.push('/portal');
        } else {
          setAuthenticated(true);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0F0A4D]">
        <div className="text-center space-y-6 animate-pulse">
          <div className="w-16 h-16 bg-[#D4A017]/20 rounded-2xl flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8 text-[#D4A017]" />
          </div>
          <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Validando Credenciales...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) return null;

  return <>{children}</>;
}
