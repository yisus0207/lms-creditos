'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Button from '@/components/ui/Button';
import { ShieldCheck, Mail, Lock, AlertCircle, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  // Smart Redirect based on Role
  useEffect(() => {
    const checkRedirect = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const user = session.user;
      const isAdmin = user.user_metadata?.rol === 'admin';

      if (isAdmin) {
        router.push('/dashboard');
      } else {
        // Find client by user_id
        const { data: client } = await supabase
          .from('clientes')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle(); 
        
        if (client) {
          router.push('/portal');
        } else {
          // Force logout if account was deleted from DB but session persists
          await supabase.auth.signOut();
          router.refresh();
        }
      }
    };
    checkRedirect();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let loginEmail = email;

      // 1. Check if the input is a Cédula (numeric)
      const isCedula = /^\d+$/.test(email.replace(/\./g, '').trim());
      
      if (isCedula) {
        const cleanCedula = email.replace(/\./g, '').trim();
        const { data: clientData, error: clientError } = await supabase
          .from('clientes')
          .select('email')
          .eq('numero_documento', cleanCedula)
          .single();
        
        if (clientError || !clientData) {
          throw new Error('Cédula no registrada. Por favor, regístrate primero.');
        }
        loginEmail = clientData.email;
      }

      // 2. Perform Supabase Login
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password,
      });

      if (authError) {
        throw new Error(authError.message === 'Invalid login credentials' 
          ? 'Credenciales o contraseña incorrectas.' 
          : authError.message);
      }

      if (data.session) {
        const isAdmin = data.session.user.user_metadata?.rol === 'admin';
        
        if (isAdmin) {
          router.push('/dashboard');
        } else {
          // Verify if they are a client
          const { data: client } = await supabase
            .from('clientes')
            .select('id')
            .eq('user_id', data.session.user.id)
            .maybeSingle();
          
          if (client) {
            router.push('/portal');
          } else {
            await supabase.auth.signOut();
            throw new Error('Tu cuenta no se encuentra activa o ha sido eliminada. Contacta al administrador.');
          }
        }
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError('Por favor, ingresa tu correo corporativo primero.');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login/reset-password`,
      });
      if (resetError) throw resetError;
      setResetSent(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen bg-[#060318] overflow-hidden">

      {/* ===== PANEL IZQUIERDO: MARCA & VISUAL ===== */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] relative p-14 overflow-hidden">
        {/* Fondo con orbs y grid */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
          <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] rounded-full bg-[#D4A017]/10 blur-[150px]" />
          <div className="absolute bottom-[-100px] right-[-50px] w-[400px] h-[400px] rounded-full bg-blue-600/10 blur-[130px]" />
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <img src="/images/logo.jpg" alt="LMS" className="w-10 h-10 rounded-xl border border-white/10" />
          <div>
            <p className="text-white font-black text-base tracking-tighter">LMS Créditos</p>
            <p className="text-white/30 text-[10px] uppercase tracking-widest">Portal Seguro</p>
          </div>
        </div>

        {/* Headline del panel */}
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#D4A017]/10 border border-[#D4A017]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4A017] animate-pulse" />
            <span className="text-[10px] font-black text-[#D4A017] uppercase tracking-widest">Acceso Seguro al Sistema</span>
          </div>
          <h2 className="text-5xl font-black text-white leading-[1.05] tracking-tighter">
            Bienvenido<br />de regreso<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4A017] to-[#f0c040]">a tu gestión.</span>
          </h2>
          <p className="text-white/40 font-medium leading-relaxed max-w-xs">
            Monitorea tu trámite en tiempo real. Cada paso, cada documento, cada aprobación.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4">
            {[
              { value: '+500', label: 'Familias', icon: '🏠' },
              { value: '98%', label: 'Aprobados', icon: '✅' },
              { value: '72h', label: 'Respuesta', icon: '⚡' },
            ].map((s, i) => (
              <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-4 text-center">
                <div className="text-xl mb-1">{s.icon}</div>
                <div className="text-lg font-black text-white">{s.value}</div>
                <div className="text-[10px] text-white/30 font-bold uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer del panel */}
        <div className="relative z-10">
          <p className="text-white/20 text-[11px] font-medium">© 2025 LMS Créditos Hipotecarios · Cifrado AES-256</p>
        </div>
      </div>

      {/* ===== PANEL DERECHO: FORMULARIO ===== */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative">
        {/* Orb sutil derecha */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-purple-700/10 blur-[120px] pointer-events-none" />

        {/* Back button */}
        <button
          onClick={() => router.push('/')}
          className="absolute top-8 left-8 flex items-center gap-2 text-white/30 hover:text-white/70 transition-colors z-20"
        >
          <span className="text-sm">←</span>
          <span className="text-xs font-bold uppercase tracking-widest">Inicio</span>
        </button>

        <div className="relative z-10 w-full max-w-md">
          {/* Encabezado del form */}
          <div className="mb-10">
            {/* Solo visible en mobile */}
            <div className="flex lg:hidden items-center gap-3 mb-8">
              <img src="/images/logo.jpg" alt="LMS" className="w-10 h-10 rounded-xl border border-white/10" />
              <p className="text-white font-black text-base tracking-tighter">LMS Créditos</p>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter mb-2">Iniciar sesión</h1>
            <p className="text-white/40 text-sm font-medium">Ingresa tu correo o número de cédula</p>
          </div>

          {/* Errores y confirmaciones */}
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3 text-rose-300 text-sm font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {resetSent && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 text-emerald-300 text-sm font-medium">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>¡Correo de recuperación enviado! Revisa tu bandeja.</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-black text-white/40 uppercase tracking-widest mb-2">Correo o Cédula</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                  required
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="correo@email.com o 1.094.000.000"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-11 pr-4 text-white text-sm placeholder:text-white/15 focus:outline-none focus:border-[#D4A017]/40 focus:bg-white/8 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-white/40 uppercase tracking-widest mb-2">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-11 pr-4 text-white text-sm placeholder:text-white/10 focus:outline-none focus:border-[#D4A017]/40 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-2xl bg-[#D4A017] text-[#060318] font-black text-base hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_40px_rgba(212,160,23,0.25)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Verificando...' : 'Entrar al sistema →'}
            </button>
          </form>

          {/* Links secundarios */}
          <div className="mt-8 flex flex-col items-center gap-4">
            <button
              type="button"
              onClick={handleResetPassword}
              disabled={loading || resetSent}
              className="text-xs text-white/30 hover:text-[#D4A017] font-bold uppercase tracking-widest transition-colors disabled:opacity-40"
            >
              ¿Olvidaste tu contraseña?
            </button>
            <div className="w-full h-px bg-white/5" />
            <p className="text-xs text-white/30 font-medium">¿No tienes cuenta?{' '}
              <button onClick={() => router.push('/register')} className="text-[#D4A017] font-black hover:underline">
                Regístrate aquí
              </button>
            </p>
          </div>
        </div>
      </div>

    </main>
  );
}

