import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

// TODO: 새 주제에 맞게 title/description 교체. PWA(홈 화면 추가)는 app/manifest.ts.
export const metadata: Metadata = {
  title: '지킴e — 복지 끊김 점검',
  description: '받던 복지가 끊기기 전에. 어르신이 말로 점검하는 자격 변동 비서.',
  icons: { icon: '/icon-192.png', apple: '/icon-192.png' },
  appleWebApp: { capable: true, title: '지킴e', statusBarStyle: 'default' },
};

export const viewport: Viewport = {
  themeColor: '#256ef4',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-gray-5 font-sans text-body-m text-gray-90">
        <Header />
        <main id="main" className="min-h-[60vh]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
