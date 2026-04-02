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
      <div className="flex h-screen overflow-hidden bg-gray-50 main-layout-container">
        {/* Sidebar (Desktop) */}
        <div className="desktop-sidebar-container h-full">
          <Sidebar aria-label="Sidebar principal" />
        </div>

        {/* Mobile Navigation (Bottom Bar) */}
        <div className="mobile-nav-container">
          <MobileNav />
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto w-full relative">
          <div className="mx-auto max-w-7xl p-6 lg:p-8">{children}</div>
          
          {/* AI Assistant Alexa (Floating) */}
          <AlexaAssistant />
        </main>
      </div>
    </AuthGuard>
  );
}
