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
      const isAdmin = user.email?.endsWith('@lmscreditos.com');

      if (isAdmin) {
        router.push('/dashboard');
      } else {
        // Find client by user_id
        const { data: client } = await supabase
          .from('clientes')
          .select('id')
          .eq('user_id', user.id)
          .single();
        
        if (client) {
          router.push('/portal');
        } else {
          // If not a client, treat as Admin/Staff fallback
          router.push('/dashboard'); 
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
        const isAdmin = loginEmail.endsWith('@lmscreditos.com');
        
        if (isAdmin) {
          router.push('/dashboard');
        } else {
          // Verify if they are a client
          const { data: client } = await supabase
            .from('clientes')
            .select('id')
            .eq('user_id', data.session.user.id)
            .single();
          
          if (client) {
            router.push('/portal');
          } else {
            // Default to dashboard for non-client registered users
            router.push('/dashboard');
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
    <main className="flex min-h-screen items-center justify-center bg-[#0F0A4D] px-4 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#D4A017]/5 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[100px]" />
      
      {/* Back to Home Button */}
      <button 
        onClick={() => router.push('/')}
        className="absolute top-8 left-8 flex items-center gap-2 text-white/40 hover:text-[#D4A017] transition-all group/back z-20"
      >
        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover/back:bg-[#D4A017]/10 transition-colors">
          <Sparkles className="w-4 h-4" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest">Volver al Inicio</span>
      </button>
      
      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-700">
        {/* Brand Header */}
        <div className="mb-10 text-center">
          <img 
            src="/images/logo.jpg" 
            alt="LMS Logo" 
            className="w-24 h-24 rounded-[32px] mx-auto mb-6 shadow-2xl shadow-[#D4A017]/20 border-2 border-[#D4A017]/10 animate-in zoom-in duration-1000"
          />
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">LMS</h1>
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-3 h-3 text-[#D4A017]" />
            <p className="text-xs font-bold text-white/40 uppercase tracking-[0.2em]">Acceso Seguro al Sistema</p>
          </div>
        </div>

        {/* Login Card (Glassmorphism) */}
        <div className="rounded-[40px] bg-white/5 backdrop-blur-xl border border-white/10 p-10 shadow-2xl overflow-hidden group">
          {/* Subtle light beam effect */}
          <div className="absolute -inset-x-full top-0 h-px bg-gradient-to-r from-transparent via-[#D4A017]/30 to-transparent group-hover:inset-x-full transition-all duration-1000" />

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3 text-rose-200 text-sm font-medium animate-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {resetSent && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 text-emerald-200 text-sm font-medium animate-in slide-in-from-top-2">
              <Sparkles className="w-5 h-5 shrink-0" />
              <span>¡Correo de recuperación enviado! Revisa tu bandeja de entrada.</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">
                Correo Corporativo
              </label>
              <div className="relative group/input">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within/input:text-[#D4A017] transition-colors" />
                <input
                  required
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Cédula o Correo electrónico"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#D4A017]/50 focus:ring-4 focus:ring-[#D4A017]/5 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">
                Contraseña Secreta
              </label>
              <div className="relative group/input">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within/input:text-[#D4A017] transition-colors" />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/10 focus:outline-none focus:border-[#D4A017]/50 focus:ring-4 focus:ring-[#D4A017]/5 transition-all"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              loading={loading}
              className="w-full h-16 rounded-2xl text-lg relative overflow-hidden group/btn shadow-2xl shadow-amber-900/20"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
              Ingresar al Sistema
            </Button>
          </form>

          <div className="mt-10 text-center">
            <button 
              type="button"
              onClick={handleResetPassword}
              disabled={loading || resetSent}
              className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] hover:text-[#D4A017] transition-colors disabled:opacity-50"
            >
              {loading ? 'Procesando...' : '¿Olvidaste tu contraseña? Recuperar aquí'}
            </button>

            <div className="mt-8 pt-8 border-t border-white/5">
              <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-4">¿Nuevo en LMS?</p>
              <Button 
                onClick={() => router.push('/register')}
                className="w-full h-12 bg-transparent border border-white/10 hover:bg-white/5 text-[#D4A017] rounded-xl font-black text-[10px] uppercase tracking-[0.2em]"
              >
                CREAR MI CUENTA
              </Button>
            </div>
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-10 flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-6 opacity-30">
            <div className="h-[1px] w-12 bg-white" />
            <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Secure Gateway</span>
            <div className="h-[1px] w-12 bg-white" />
          </div>
          <p className="text-[10px] text-white/20 font-medium">Sincronizado con Supabase Auth & AES-256 Encryption</p>
        </div>
      </div>
    </main>
  );
}
