import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

// ── Font ──────────────────────────────────────────────
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

// ── Default Metadata ──────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: 'Kreoon Reports — Análisis de Contenido con IA',
    template: '%s | Kreoon Reports',
  },
  description:
    'Análisis estratégico profundo de contenido viral. Decodifica por qué funciona, replica el éxito y supera a tu competencia con IA.',
  keywords: [
    'UGC',
    'análisis contenido',
    'estrategia redes sociales',
    'viral',
    'kreoon',
    'Colombia',
    'IA',
  ],
  authors: [{ name: 'Kreoon', url: 'https://kreoon.com' }],
  creator: 'Kreoon',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? 'https://reports.kreoon.com'
  ),
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    siteName: 'Kreoon Reports',
    images: [
      {
        url: '/og-default.png',
        width: 1200,
        height: 630,
        alt: 'Kreoon Reports',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@kreoon',
  },
  robots: {
    index: false, // reports are private by default
    follow: false,
  },
};

export const viewport: Viewport = {
  themeColor: '#7c3aed',
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'dark',
};

// ── Root Layout ───────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} dark`} suppressHydrationWarning>
      <body className={`${inter.className} antialiased bg-surface-dark text-white min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
