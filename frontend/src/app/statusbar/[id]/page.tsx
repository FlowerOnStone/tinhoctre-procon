// pages/statusbar/[id]/page.tsx

import { notFound } from 'next/navigation';
import StatusBar from '@/components/statusbar/StatusBar'; // Adjust the path as necessary

export default async function StatusBarPage({ params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return notFound();
  }

  return (
    <StatusBar id={id} />
  );
}
