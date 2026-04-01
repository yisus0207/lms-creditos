import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'LMS Créditos – Gestión de Créditos Hipotecarios',
    template: '%s – LMS Créditos',
  },
  description:
    'Plataforma integral de gestión de créditos hipotecarios: viabilidad, documentación y aprobación bancaria.',
  metadataBase: new URL('https://lmscreditos.com'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="es" 
      className={`${geist.variable} h-full antialiased`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full" suppressHydrationWarning>{children}</body>
    </html>
  );
}
