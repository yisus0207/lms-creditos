'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Button from '@/components/ui/Button';
import { ShieldCheck, Lock, AlertCircle, Sparkles, CheckCircle2, User } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: resetError } = await supabase.auth.updateUser({
        password: password,
        data: { full_name: fullName }
      });

      if (resetError) throw resetError;

      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0F0A4D] px-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#D4A017]/5 rounded-full blur-[120px] animate-pulse" />
      
      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-700">
        {/* Brand Header */}
        <div className="mb-10 text-center">
          <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <ShieldCheck className="w-10 h-10 text-[#D4A017]" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">Nueva Contraseña</h1>
          <p className="text-xs font-bold text-white/40 uppercase tracking-[0.2em]">Restablece tu acceso seguro</p>
        </div>

        {/* Form Card */}
        <div className="rounded-[40px] bg-white/5 backdrop-blur-xl border border-white/10 p-10 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3 text-rose-200 text-sm font-medium">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div className="text-center space-y-4 py-6">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-white">¡Contraseña Actualizada!</h2>
              <p className="text-sm text-white/60">Serás redirigido al inicio de sesión en unos segundos...</p>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">
                  Nombre Completo
                </label>
                <div className="relative group/input">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within/input:text-[#D4A017] transition-colors" />
                  <input
                    required
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ej: David Salas"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/10 focus:outline-none focus:border-[#D4A017]/50 focus:ring-4 focus:ring-[#D4A017]/5 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">
                  Nueva Contraseña
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

              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">
                  Confirmar Contraseña
                </label>
                <div className="relative group/input">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within/input:text-[#D4A017] transition-colors" />
                  <input
                    required
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/10 focus:outline-none focus:border-[#D4A017]/50 focus:ring-4 focus:ring-[#D4A017]/5 transition-all"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                loading={loading}
                className="w-full h-16 rounded-2xl text-lg shadow-2xl shadow-amber-900/20"
              >
                Actualizar Contraseña
              </Button>
            </form>
          )}
        </div>

        <div className="mt-10 text-center">
          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Protocolo de Seguridad LMS</p>
        </div>
      </div>
    </main>
  );
}
