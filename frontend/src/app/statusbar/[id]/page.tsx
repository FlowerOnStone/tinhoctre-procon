'use client';

import { notFound, useRouter } from 'next/navigation';
import StatusBar from '@/components/statusbar/StatusBar'; // Adjust the path as necessary
import { ChevronLeft } from 'lucide-react';

export default function StatusBarPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();

  if (!id) {
    return notFound();
  }

  const handleBack = () => {
    router.back();
  };

  return (
    <div>
      <div className="flex gap-2">
        <ChevronLeft className="h-8 w-8" onClick={handleBack} />
        <h1 className="text-3xl font-bold">Chi tiết trận đấu</h1>
      </div>
      <StatusBar id={id} />
    </div>
  );
}
