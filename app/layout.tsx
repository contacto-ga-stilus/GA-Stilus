import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GA Stilus',
  description: 'Moda con calidad y prestigio',
  applicationName: 'GA Stilus',
  manifest: '/manifest.webmanifest',
  themeColor: '#0b1f4b',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
      { url: '/icon.png', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico'],
    apple: [{ url: '/apple-icon.png', type: 'image/png' }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'GA Stilus',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}