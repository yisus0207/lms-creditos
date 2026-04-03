'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Button from '@/components/ui/Button';
import { User, Mail, Lock, CreditCard, Phone, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: '',
    cedula: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Sign Up in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.nombre,
            cedula: formData.cedula
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Create entry in 'clientes' table
        const { error: dbError } = await supabase
          .from('clientes')
          .insert([{
            user_id: authData.user.id,
            nombre: formData.nombre,
            numero_documento: formData.cedula,
            tipo_documento: 'CC',
            email: formData.email,
            telefono: formData.telefono,
            created_at: new Date().toISOString()
          }]);

        if (dbError) throw dbError;
        
        setSuccess(true);
        setTimeout(() => router.push('/login'), 3000);
      }
    } catch (err: any) {
      console.error('Registration Error:', err);
      setError(err.message || 'Error al completar el registro.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0F0A4D] px-4">
        <div className="w-full max-w-md text-center space-y-6 animate-in zoom-in duration-500">
           <div className="w-20 h-20 bg-emerald-500/20 rounded-[32px] flex items-center justify-center mx-auto border border-emerald-500/30">
             <CheckCircle2 className="w-10 h-10 text-emerald-400" />
           </div>
           <h2 className="text-3xl font-black text-white uppercase tracking-tighter">¡Registro Exitoso!</h2>
           <p className="text-gray-400 font-medium">Tu cuenta ha sido creada. Serás redirigido al login en segundos...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0F0A4D] px-4 py-12 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] bg-[#D4A017]/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[120px]" />

      <div className="w-full max-w-2xl relative z-10">
        <div className="mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-6 px-4">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/images/logo.jpg" alt="Logo" className="w-12 h-12 rounded-2xl shadow-xl border border-[#D4A017]/20" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4A017]">Portal de Autogestión</span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Crear Nueva Cuenta</h1>
          </div>
          <button 
            onClick={() => router.push('/login')}
            className="text-xs font-black text-white/40 uppercase tracking-widest hover:text-[#D4A017] transition-colors"
          >
            ¿Ya tienes cuenta? Iniciar Sesión
          </button>
        </div>

        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] p-8 sm:p-12 shadow-2xl relative overflow-hidden group">
          {error && (
            <div className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-200 text-sm font-medium animate-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Nombre Completo</label>
              <div className="relative group/input">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within/input:text-[#D4A017] transition-colors" />
                <input required name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Ej: Juan Pérez" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/10 focus:outline-none focus:border-[#D4A017]/50 transition-all font-medium" />
              </div>
            </div>

            {/* Cédula */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Número de Cédula</label>
              <div className="relative group/input">
                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within/input:text-[#D4A017] transition-colors" />
                <input required name="cedula" value={formData.cedula} onChange={handleChange} placeholder="1.094.243..." className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/10 focus:outline-none focus:border-[#D4A017]/50 transition-all font-medium" />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Correo Electrónico</label>
              <div className="relative group/input">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within/input:text-[#D4A017] transition-colors" />
                <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="correo@ejemplo.com" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/10 focus:outline-none focus:border-[#D4A017]/50 transition-all font-medium" />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">WhatsApp / Teléfono</label>
              <div className="relative group/input">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within/input:text-[#D4A017] transition-colors" />
                <input required name="telefono" value={formData.telefono} onChange={handleChange} placeholder="+57 300..." className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/10 focus:outline-none focus:border-[#D4A017]/50 transition-all font-medium" />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Contraseña (Mín. 6 caracteres)</label>
              <div className="relative group/input">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within/input:text-[#D4A017] transition-colors" />
                <input required type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/10 focus:outline-none focus:border-[#D4A017]/50 transition-all font-medium" />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Confirmar Contraseña</label>
              <div className="relative group/input">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within/input:text-[#D4A017] transition-colors" />
                <input required type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/10 focus:outline-none focus:border-[#D4A017]/50 transition-all font-medium" />
              </div>
            </div>

            <div className="md:col-span-2 pt-4">
              <Button 
                type="submit" 
                loading={loading}
                className="w-full h-16 rounded-2xl text-lg gap-3 relative overflow-hidden group/btn shadow-2xl shadow-amber-900/20"
              >
                <Sparkles className="w-5 h-5 animate-pulse text-[#D4A017]" />
                REGISTRAR MIS DATOS
              </Button>
            </div>
          </form>
        </div>

        <p className="mt-8 text-center text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">
          Toda la información es encriptada con grado bancario
        </p>
      </div>
    </main>
  );
}
