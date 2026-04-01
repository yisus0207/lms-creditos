import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Servicios – LMS Créditos',
  description:
    'Conoce en detalle nuestros servicios de gestión de créditos hipotecarios.',
};

export default function ServiciosPage() {
  return (
    <>
      <main className="min-h-screen bg-gray-50 py-20 px-4">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-extrabold text-[#0F0A4D]">Servicios</h1>
          <p className="mt-3 text-gray-500">
            Ofrecemos acompañamiento integral en cada etapa del proceso.
          </p>

          <div className="mt-12 space-y-8">
            {[
              {
                title: 'Estudio de Viabilidad',
                price: 'Tarifa inicial',
                description:
                  'Análisis completo de tu perfil financiero, capacidad de endeudamiento y posibilidades de aprobación.',
                items: [
                  'Revisión de ingresos y egresos',
                  'Análisis de historial crediticio',
                  'Informe de viabilidad personalizado',
                ],
              },
              {
                title: 'Gestión Documental',
                price: 'Tarifa de gestión',
                description:
                  'Recopilamos, organizamos y preparamos toda la documentación requerida por las entidades bancarias.',
                items: [
                  'Checklist personalizado',
                  'Revisión y validación de documentos',
                  'Preparación de carpeta digital',
                ],
              },
              {
                title: 'Comisión de Éxito',
                price: 'Solo si aprueba',
                description:
                  'Cobro de comisión únicamente cuando el crédito hipotecario es aprobado exitosamente.',
                items: [
                  'Radicación ante el banco',
                  'Seguimiento hasta aprobación',
                  'Acompañamiento en firma',
                ],
              },
            ].map((service) => (
              <div
                key={service.title}
                className="rounded-2xl bg-white p-8 border border-gray-100 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <h2 className="text-xl font-bold text-[#0F0A4D]">{service.title}</h2>
                  <span className="text-sm font-medium text-[#D4A017]">{service.price}</span>
                </div>
                <p className="mt-3 text-gray-500">{service.description}</p>
                <ul className="mt-4 space-y-2">
                  {service.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-[#D4A017]">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
