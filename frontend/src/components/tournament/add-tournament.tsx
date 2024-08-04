'use client';

import { Button } from '../ui/button';
import { useAppContext } from '@/app/app-provider';
import { useRouter } from 'next/navigation';

export default function AddTournamentButton() {
  const { user } = useAppContext();
  const router = useRouter();

  if (!user || !user.is_admin) {
    return null;
  }

  function onClick() {
    router.push('/tournaments/create');
  }

  return (
    <Button size={'lg'} onClick={onClick}>
      Tạo cuộc thi
    </Button>
  );
}
