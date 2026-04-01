import type { Metadata } from 'next';
import ClientPortalHeader from '@/components/layout/ClientPortalHeader';

export const metadata: Metadata = {
  title: 'Mi Portal – LMS Créditos',
  description: 'Consulta el estado de tu crédito y gestiona tus documentos.',
};

export default function ClienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <ClientPortalHeader />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
