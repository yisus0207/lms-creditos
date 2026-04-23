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
            rol: 'cliente',
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
    <main className="flex min-h-screen bg-[#060318] overflow-hidden">

      {/* ===== PANEL IZQUIERDO: MARCA & BENEFICIOS ===== */}
      <div className="hidden lg:flex flex-col justify-between w-[40%] relative p-14 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
          <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] rounded-full bg-[#D4A017]/10 blur-[150px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-purple-600/10 blur-[130px]" />
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <img src="/images/logo.jpg" alt="LMS" className="w-10 h-10 rounded-xl border border-white/10" />
          <div>
            <p className="text-white font-black text-base tracking-tighter">LMS Créditos</p>
            <p className="text-white/30 text-[10px] uppercase tracking-widest">Portal Seguro</p>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-4xl font-black text-white leading-[1.05] tracking-tighter mb-4">
              Tu crédito,<br />tu futuro,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4A017] to-[#f0c040]">empieza aquí.</span>
            </h2>
            <p className="text-white/40 font-medium leading-relaxed max-w-xs">
              Crea tu cuenta gratis y comienza a gestionar tu crédito hipotecario en minutos.
            </p>
          </div>

          {/* Beneficios */}
          <div className="space-y-4">
            {[
              { icon: '🔒', title: 'Datos 100% seguros', desc: 'Cifrado AES-256 de grado bancario' },
              { icon: '⚡', title: 'Respuesta en 72h', desc: 'Estudio de viabilidad express' },
              { icon: '🏠', title: 'Seguimiento en tiempo real', desc: 'Estado de tu trámite siempre visible' },
              { icon: '🎁', title: 'Escrituras gratis', desc: 'Promoción de aniversario activa' },
            ].map((b, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-lg flex-shrink-0">{b.icon}</div>
                <div>
                  <p className="text-white font-bold text-sm">{b.title}</p>
                  <p className="text-white/30 text-xs font-medium">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-white/20 text-[11px] font-medium">© 2025 LMS Créditos Hipotecarios</p>
        </div>
      </div>

      {/* ===== PANEL DERECHO: FORMULARIO ===== */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative overflow-y-auto">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-blue-600/8 blur-[120px] pointer-events-none" />

        <button
          onClick={() => router.push('/')}
          className="absolute top-8 left-8 flex items-center gap-2 text-white/30 hover:text-white/70 transition-colors z-20"
        >
          <span className="text-sm">←</span>
          <span className="text-xs font-bold uppercase tracking-widest">Inicio</span>
        </button>

        <div className="relative z-10 w-full max-w-xl">
          {/* Encabezado */}
          <div className="mb-8">
            <div className="flex lg:hidden items-center gap-3 mb-6">
              <img src="/images/logo.jpg" alt="LMS" className="w-10 h-10 rounded-xl border border-white/10" />
              <p className="text-white font-black text-base tracking-tighter">LMS Créditos</p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-black text-white tracking-tighter mb-1">Crear cuenta</h1>
                <p className="text-white/40 text-sm font-medium">Completa tu información para comenzar</p>
              </div>
              <button
                onClick={() => router.push('/login')}
                className="text-xs text-[#D4A017] font-bold hover:underline hidden sm:block"
              >
                ¿Ya tienes cuenta? →
              </button>
            </div>
          </div>

          {/* Success State */}
          {success && (
            <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white mb-2">¡Cuenta creada!</h3>
                <p className="text-white/50 text-sm">En breve un asesor LMS se pondrá en contacto contigo.</p>
              </div>
              <button
                onClick={() => router.push('/login')}
                className="h-12 px-8 rounded-2xl bg-[#D4A017] text-[#060318] font-black text-sm hover:scale-105 transition-all"
              >
                Iniciar sesión →
              </button>
            </div>
          )}

          {!success && (
            <>
              {error && (
                <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3 text-rose-300 text-sm font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Nombre */}
                  <div>
                    <label className="block text-xs font-black text-white/40 uppercase tracking-widest mb-2">Nombre Completo</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <input required name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Ej: Juan Pérez"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-11 pr-4 text-white text-sm placeholder:text-white/15 focus:outline-none focus:border-[#D4A017]/40 transition-all" />
                    </div>
                  </div>
                  {/* Cédula */}
                  <div>
                    <label className="block text-xs font-black text-white/40 uppercase tracking-widest mb-2">Número de Cédula</label>
                    <div className="relative">
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <input required name="cedula" value={formData.cedula} onChange={handleChange} placeholder="1.094.243..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-11 pr-4 text-white text-sm placeholder:text-white/15 focus:outline-none focus:border-[#D4A017]/40 transition-all" />
                    </div>
                  </div>
                  {/* Email */}
                  <div>
                    <label className="block text-xs font-black text-white/40 uppercase tracking-widest mb-2">Correo Electrónico</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="correo@email.com"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-11 pr-4 text-white text-sm placeholder:text-white/15 focus:outline-none focus:border-[#D4A017]/40 transition-all" />
                    </div>
                  </div>
                  {/* Teléfono */}
                  <div>
                    <label className="block text-xs font-black text-white/40 uppercase tracking-widest mb-2">WhatsApp / Teléfono</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <input required name="telefono" value={formData.telefono} onChange={handleChange} placeholder="+57 300..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-11 pr-4 text-white text-sm placeholder:text-white/15 focus:outline-none focus:border-[#D4A017]/40 transition-all" />
                    </div>
                  </div>
                  {/* Password */}
                  <div>
                    <label className="block text-xs font-black text-white/40 uppercase tracking-widest mb-2">Contraseña</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <input required type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Mín. 6 caracteres"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-11 pr-4 text-white text-sm placeholder:text-white/15 focus:outline-none focus:border-[#D4A017]/40 transition-all" />
                    </div>
                  </div>
                  {/* Confirm Password */}
                  <div>
                    <label className="block text-xs font-black text-white/40 uppercase tracking-widest mb-2">Confirmar Contraseña</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <input required type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Repetir contraseña"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-11 pr-4 text-white text-sm placeholder:text-white/15 focus:outline-none focus:border-[#D4A017]/40 transition-all" />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 rounded-2xl bg-[#D4A017] text-[#060318] font-black text-base hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_40px_rgba(212,160,23,0.25)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? 'Creando cuenta...' : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Registrar mis datos
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 flex flex-col items-center gap-3">
                <div className="w-full h-px bg-white/5" />
                <p className="text-xs text-white/20 font-medium text-center">
                  Al registrarte aceptas nuestra política de privacidad · Cifrado AES-256
                </p>
                <button
                  onClick={() => router.push('/login')}
                  className="sm:hidden text-xs text-[#D4A017] font-bold hover:underline"
                >
                  ¿Ya tienes cuenta? Iniciar sesión
                </button>
              </div>
            </>
          )}
        </div>
      </div>

    </main>
  );
}




