import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PUBG Stats Dashboard',
  description: 'חיפוש, מעקב והשוואת שחקני PUBG עד 4 יחד',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="he" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
