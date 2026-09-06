import './globals.css';
import type { Metadata, Viewport } from 'next';

// 1. PWA用ビューポート・テーマカラー設定（Next.js 13.5+ 推奨仕様）
export const viewport: Viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

// 2. PWA・メタデータ設定
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  ),
  title: '消防用感知器 自動選定システム',
  description:
    '消防法に基づき、部屋の条件から適切な感知器と必要数量を自動算定します。',
  manifest: '/manifest.webmanifest', // app/manifest.ts から自動生成されるマニフェストへのリンク
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
  // iOS (iPhone / iPad) ホーム画面追加時のスタンドアロン設定
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '感知器選定',
  },
  openGraph: {
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}