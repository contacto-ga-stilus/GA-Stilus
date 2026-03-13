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
        src: '/icon.jpg',
        sizes: '192x192',
        type: 'image/jpeg',
      },
      {
        src: '/icon.jpg',
        sizes: '512x512',
        type: 'image/jpeg',
      },
      {
        src: '/apple-icon.jpg',
        sizes: '180x180',
        type: 'image/jpeg',
      },
    ],
  };
}
