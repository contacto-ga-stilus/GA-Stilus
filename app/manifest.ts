import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'GA Stilus',
    short_name: 'GA Stilus',
    description: 'Moda con calidad y prestigio',
    start_url: '/',
    display: 'standalone',
    background_color: '#0b1f4b',
    theme_color: '#0b1f4b',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
