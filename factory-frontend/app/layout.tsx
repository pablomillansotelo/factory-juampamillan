import './globals.css';

import { Analytics } from '@vercel/analytics/react';

export const metadata = {
  title: 'Factory - Catálogo Interno de Manufactura',
  description:
    'Sistema de gestión del catálogo interno de manufactura. Administra items internos, atributos técnicos y disponibilidad.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="flex min-h-screen w-full flex-col">{children}</body>
      <Analytics />
    </html>
  );
}

