import AnnouncementBanner from '@/components/layout/AnnouncementBanner';
import Navbar from '@/components/layout/Navbar';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      <AnnouncementBanner />
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <footer className="bg-[#07152d] py-12 px-4 text-center border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 opacity-60">
            <span className="text-xl font-black text-white tracking-tighter uppercase">LMS Créditos</span>
          </div>
          <p className="text-sm text-white/30">
            © {new Date().getFullYear()} LMS Créditos. Gestión Inteligente de Créditos Hipotecarios.
            <br />
            Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
