import type { Metadata } from 'next';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Contacto – LMS Créditos',
  description:
    'Contáctanos para iniciar la gestión de tu crédito hipotecario.',
};

export default function ContactoPage() {
  return (
    <>
      <main className="min-h-screen bg-gray-50 py-20 px-4">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-4xl font-extrabold text-[#0F0A4D]">Contáctanos</h1>
          <p className="mt-3 text-gray-500">
            Cuéntanos tu situación y te asesoraremos sin compromiso.
          </p>

          <form className="mt-10 space-y-6 rounded-2xl bg-white p-8 border border-gray-100 shadow-sm">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre completo
                </label>
                <input
                  type="text"
                  placeholder="Juan Pérez"
                  className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#0F0A4D] focus:outline-none focus:ring-2 focus:ring-[#0F0A4D]/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Teléfono
                </label>
                <input
                  type="tel"
                  placeholder="+57 300 000 0000"
                  className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#0F0A4D] focus:outline-none focus:ring-2 focus:ring-[#0F0A4D]/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <input
                type="email"
                placeholder="juan@ejemplo.com"
                className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#0F0A4D] focus:outline-none focus:ring-2 focus:ring-[#0F0A4D]/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                ¿En qué podemos ayudarte?
              </label>
              <textarea
                rows={4}
                placeholder="Cuéntanos sobre tu necesidad de crédito..."
                className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#0F0A4D] focus:outline-none focus:ring-2 focus:ring-[#0F0A4D]/20 resize-none"
              />
            </div>

            <Button type="submit" size="lg" className="w-full">
              Enviar mensaje
            </Button>
          </form>
        </div>
      </main>
    </>
  );
}
