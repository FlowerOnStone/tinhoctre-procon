import Header from '@/components/header';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      <Header isFixed={false} />
      <main className="flex flex-col items-center justify-between p-16">
        <Image src="/banner_header.jpg" alt="logo" width={2560} height={1016} />
      </main>
    </>
  );
}
