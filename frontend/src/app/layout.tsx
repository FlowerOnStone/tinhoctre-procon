import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/header';
import AppProvider from './app-provider';

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
      <body className={`${inter.className} relative`}>
        <AppProvider>
          <Header />
          <main className="absolute top-0 pt-16 w-full h-full">
            <div className="mx-auto max-w-screen-2xl w-full my-6">{children}</div>
          </main>
        </AppProvider>
      </body>
    </html>
  );
}
