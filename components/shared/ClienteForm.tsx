import { useState } from 'react';
import { ClienteService } from '@/services/cliente.service';
import Select from '@/components/ui/Select';
import { cn } from '@/lib/utils';
import { Landmark, Gem, TriangleAlert } from 'lucide-react';

interface ClienteFormProps {
  onSuccess: () => void;
  defaultTipo?: 'banco' | 'subsidio';
}

const BANCOS_PRINCIPALES = [
  'Bancolombia',
  'Davivienda',
  'Banco Caja Social',
  'Banco de Bogotá',
  'BBVA',
  'Banco de Occidente',
  'Scotiabank Colpatria',
  'Banco Popular',
  'Banco AV Villas',
  'Itaú',
  'Otro'
].map(banco => ({ id: banco, label: banco }));

export default function ClienteForm({ onSuccess, defaultTipo }: ClienteFormProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    numeroDocumento: '',
    telefono: '',
    direccion: '',
    email: '',
    banco: '',
    otroBanco: '',
    tipo_tramite: defaultTipo || ('banco' as 'banco' | 'subsidio'),
    valor_subsidio: '',
    descripcion_subsidio: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBancoChange = (value: string) => {
    setFormData(prev => ({ ...prev, banco: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formData.nombre || !formData.numeroDocumento) return;
    
    if (formData.tipo_tramite === 'subsidio' && !formData.valor_subsidio) {
      setError('Por favor ingrese el valor del subsidio.');
      return;
    }

    setLoading(true);
    try {
      const fullNombre = `${formData.nombre} ${formData.apellidos}`.trim().toUpperCase();
      
      let bancoFinal = formData.banco;
      if (bancoFinal === 'Otro' && formData.otroBanco) {
        bancoFinal = formData.otroBanco.trim().toUpperCase();
      }

      const result = await ClienteService.createCliente({
        nombre: fullNombre,
        numero_documento: formData.numeroDocumento,
        tipo_documento: 'CC', // Default
        telefono: formData.telefono,
        email: formData.email,
        direccion: formData.direccion,
        banco: bancoFinal,
        tipo_tramite: formData.tipo_tramite,
        valor_subsidio: formData.valor_subsidio ? parseFloat(formData.valor_subsidio) : undefined,
        descripcion_subsidio: formData.descripcion_subsidio?.toUpperCase(),
      });

      if (result) {
        onSuccess();
      }
    } catch (err: any) {
      console.error('Submit error details:', err);
      const errMsg = err?.message || err?.details || String(err);
      
      if (errMsg.includes('unique_numero_documento')) {
        setError('ESTE NÚMERO DE DOCUMENTO YA ESTÁ REGISTRADO EN EL SISTEMA.');
      } else {
        setError('ERROR: ' + errMsg.toUpperCase());
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full h-16 rounded-[24px] border-2 border-gray-100 bg-gray-50/40 px-6 text-sm font-black text-[#0F0A4D] transition-all focus:bg-white focus:border-[#D4A017] focus:outline-none focus:ring-4 focus:ring-[#D4A017]/5 placeholder:text-gray-300 transition-all duration-300";
  const labelClasses = "block text-[11px] font-black text-[#0F0A4D]/40 uppercase tracking-[0.2em] mb-3 px-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!defaultTipo && (
        <div className="bg-gray-50/50 p-6 rounded-[32px] border-2 border-dashed border-gray-100 mb-8">
          <label className={labelClasses}>¿Qué trámite desea registrar?</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, tipo_tramite: 'banco' }))}
              className={cn(
                "h-24 rounded-[24px] border-2 transition-all flex flex-col items-center justify-center gap-2 group relative overflow-hidden",
                formData.tipo_tramite === 'banco'
                  ? "bg-white border-[#0F0A4D] text-[#0F0A4D] shadow-xl shadow-[#0F0A4D]/10"
                  : "bg-transparent border-gray-100 text-gray-400 opacity-60 hover:opacity-100"
              )}
            >
              <Landmark className={cn("w-6 h-6", formData.tipo_tramite === 'banco' ? "text-[#D4A017]" : "text-gray-300")} />
              <span className="text-[10px] font-black uppercase tracking-widest text-center px-2">Crédito Bancario</span>
              {formData.tipo_tramite === 'banco' && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#0F0A4D]" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, tipo_tramite: 'subsidio' }))}
              className={cn(
                "h-24 rounded-[24px] border-2 transition-all flex flex-col items-center justify-center gap-2 group relative overflow-hidden",
                formData.tipo_tramite === 'subsidio'
                  ? "bg-white border-[#D4A017] text-[#D4A017] shadow-xl shadow-amber-900/10"
                  : "bg-transparent border-gray-100 text-gray-400 opacity-60 hover:opacity-100"
              )}
            >
              <Gem className={cn("w-6 h-6", formData.tipo_tramite === 'subsidio' ? "text-[#D4A017]" : "text-gray-300")} />
              <span className="text-[10px] font-black uppercase tracking-widest text-center px-2">Solo Subsidio</span>
              {formData.tipo_tramite === 'subsidio' && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#D4A017]" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* 📍 Campos dinámicos para SUBSIDIO */}
      {formData.tipo_tramite === 'subsidio' && (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500 bg-amber-50/30 p-6 rounded-[32px] border-2 border-amber-100/50 mb-8">
          <div className="flex items-center gap-3 mb-2 px-2">
             <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-black text-xs">!</div>
             <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Información del Subsidio</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="col-span-full sm:col-span-1">
              <label className={labelClasses}>Valor Total del Subsidio</label>
              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-amber-500 font-black">$</span>
                <input
                  type="number"
                  name="valor_subsidio"
                  value={formData.valor_subsidio}
                  onChange={handleChange}
                  placeholder="0.00"
                  className={cn(inputClasses, "pl-12 border-amber-100/50 focus:border-amber-400")}
                  required={formData.tipo_tramite === 'subsidio'}
                />
              </div>
            </div>
            <div className="col-span-full">
              <label className={labelClasses}>Descripción / Detalles</label>
              <textarea
                name="descripcion_subsidio"
                value={formData.descripcion_subsidio}
                onChange={handleChange}
                placeholder="Ej: Subsidio Mi Casa Ya - Concurrente"
                rows={2}
                className="w-full rounded-[24px] border-2 border-amber-100/50 bg-gray-50/40 px-6 py-4 text-sm font-black text-[#0F0A4D] focus:bg-white focus:border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-400/5 placeholder:text-gray-300 resize-none transition-all duration-300"
              />
            </div>
          </div>
        </div>
      )}
      {/* Name Group */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className={labelClasses}>Primer Nombre</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Ej: Juan"
            className={inputClasses}
            required
          />
        </div>
        <div>
          <label className={labelClasses}>Apellidos</label>
          <input
            type="text"
            name="apellidos"
            value={formData.apellidos}
            onChange={handleChange}
            placeholder="Ej: Pérez"
            className={inputClasses}
            required
          />
        </div>
      </div>

      {/* Identity & Phone */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className={labelClasses}>No. Documento (CC)</label>
          <input
            type="text"
            name="numeroDocumento"
            value={formData.numeroDocumento}
            onChange={handleChange}
            placeholder="Ej: 1094000..."
            className={inputClasses}
            required
          />
        </div>
        <div>
          <label className={labelClasses}>Teléfono / WhatsApp</label>
          <input
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            placeholder="Ej: 300 123 4567"
            className={inputClasses}
          />
        </div>
      </div>

      {/* Bank info - ONLY FOR BANK CLIENTS */}
      {formData.tipo_tramite === 'banco' && (
        <div className="grid sm:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="col-span-full sm:col-span-1">
            <Select
              label="Banco Preferido / Entidad"
              options={BANCOS_PRINCIPALES}
              value={formData.banco}
              onChange={handleBancoChange}
              placeholder="Seleccione un Banco"
            />
          </div>

          {formData.banco === 'Otro' && (
            <div className="col-span-full sm:col-span-1 animate-in fade-in slide-in-from-top-2">
              <label className={labelClasses}>¿Cuál Banco?</label>
              <input
                type="text"
                name="otroBanco"
                value={formData.otroBanco}
                onChange={handleChange}
                placeholder="Escriba el nombre del banco"
                className={inputClasses}
                required={formData.banco === 'Otro'}
              />
            </div>
          )}
        </div>
      )}

      {/* Address & Email */}
      <div className="space-y-6">
        <div>
          <label className={labelClasses}>Dirección de Residencia</label>
          <input
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            placeholder="Ej: Cl 123 #45-67 Barrio Central"
            className={inputClasses}
          />
        </div>
        <div>
          <label className={labelClasses}>Correo Electrónico (Opcional)</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Ej: juan.perez@email.com"
            className={inputClasses}
          />
        </div>
      </div>

      {/* Submit & Error Display */}
      <div className="pt-6 space-y-4">
        {error && (
          <div className="bg-rose-600 text-white p-6 rounded-[32px] flex items-start gap-4 animate-in fade-in zoom-in-95 duration-300 shadow-xl shadow-rose-900/20 border-b-4 border-rose-800">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <TriangleAlert className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black text-rose-200 uppercase tracking-[0.2em] mb-1">Error de Registro</p>
              <p className="text-sm font-black leading-tight">{error}</p>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-16 bg-gradient-to-r from-[#D4A017] to-amber-400 text-white rounded-[24px] font-black text-lg shadow-xl shadow-amber-100 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
        >
          {loading ? (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Guardando...</span>
            </div>
          ) : 'Registrar Cliente'}
        </button>
      </div>
    </form>
  );
}
