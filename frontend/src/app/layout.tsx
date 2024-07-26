import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tin Học Trẻ - Procon',
  description: 'Tin học trẻ - Procon',
  icons: [{ rel: 'icon', url: '/idea.png' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header isFixed={false} />
        <main className="w-full h-full">{children}</main>
      </body>
    </html>
  );
}
