import { useState } from 'react';
import { ClienteService } from '@/services/cliente.service';
import Button from '@/components/ui/Button';

interface ClienteFormProps {
  onSuccess: () => void;
}

export default function ClienteForm({ onSuccess }: ClienteFormProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    numeroDocumento: '',
    telefono: '',
    direccion: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre || !formData.numeroDocumento) return;

    setLoading(true);
    try {
      const fullNombre = `${formData.nombre} ${formData.apellidos}`.trim();
      const result = await ClienteService.createCliente({
        nombre: fullNombre,
        numero_documento: formData.numeroDocumento,
        tipo_documento: 'CC', // Default
        telefono: formData.telefono,
        email: formData.email,
        direccion: formData.direccion,
      });

      if (result) {
        onSuccess();
      }
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full rounded-2xl border border-gray-100 bg-gray-50/50 px-5 py-4 text-sm font-medium text-[#0F0A4D] transition-all focus:bg-white focus:border-[#D4A017] focus:outline-none focus:ring-4 focus:ring-[#D4A017]/5 placeholder:text-gray-300";
  const labelClasses = "block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
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

      {/* Submit */}
      <div className="pt-6">
        <Button 
          type="submit" 
          disabled={loading} 
          className="w-full h-16 bg-[#D4A017] hover:bg-[#B8860B] text-white rounded-2xl font-black text-lg shadow-xl shadow-amber-100 transition-all active:scale-95"
        >
          {loading ? (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Guardando...</span>
            </div>
          ) : 'Registrar Cliente'}
        </Button>
      </div>
    </form>
  );
}
