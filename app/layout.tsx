import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://ga-stilus.com'),
  title: 'GA Stilus',
  description: 'Moda con calidad y prestigio',
  applicationName: 'GA Stilus',
  manifest: '/manifest.webmanifest',
  themeColor: '#0b1f4b',
  icons: {
    icon: [{ url: '/icon.jpg', type: 'image/jpeg' }],
    shortcut: ['/icon.jpg'],
    apple: [{ url: '/apple-icon.jpg', type: 'image/jpeg' }],
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