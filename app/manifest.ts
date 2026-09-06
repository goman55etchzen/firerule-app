import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '消防用感知器 自動選定システム',
    short_name: '感知器選定',
    description: '消防法に基づき、部屋の条件から適切な感知器と必要数量を自動算定します。',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#0f172a',
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
    ],
  };
}