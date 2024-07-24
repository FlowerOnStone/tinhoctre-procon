import Header from '@/components/header';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tin Học Trẻ - Procon',
  description: 'Tin học trẻ - Procon',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header isFixed={true} />
      {children}
    </>
  );
}
