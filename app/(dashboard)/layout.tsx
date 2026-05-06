import type { Metadata } from 'next';
import Sidebar from '@/components/layout/Sidebar';
import MobileNav from '@/components/layout/MobileNav';
import AuthGuard from '@/components/shared/AuthGuard';
import AlexaAssistant from '@/components/shared/AlexaAssistant';

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
      {/* App Shell: flex h-dvh overflow-hidden — igual al patrón Kovi */}
      <div className="app-shell bg-gray-50">

        {/* Sidebar — solo desktop (lg+), controlado por CSS */}
        <div className="desktop-sidebar-container">
          <Sidebar />
        </div>

        {/* Área principal scrollable */}
        <main className="main-scroll-area relative">
          <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
            {children}
          </div>

          {/* Alexa solo desktop — en mobile va integrada en el tab bar */}
          <div className="hidden lg:block">
            <AlexaAssistant />
          </div>
        </main>

      </div>

      {/* Tab Bar mobile — FUERA del app-shell, fixed al viewport */}
      <MobileNav />
    </AuthGuard>
  );
}
