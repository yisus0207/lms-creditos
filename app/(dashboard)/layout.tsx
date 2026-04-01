import type { Metadata } from 'next';
import Sidebar from '@/components/layout/Sidebar';
import AuthGuard from '@/components/shared/AuthGuard';

export const metadata: Metadata = {
  title: 'Panel de Administración – LMS Créditos',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </AuthGuard>
  );
}
