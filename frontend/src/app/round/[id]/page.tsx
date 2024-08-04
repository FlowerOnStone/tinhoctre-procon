'use client';

import matchApiRequest from '@/api/match';
import { RoundType } from '@/schema/match';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ScoreTable } from '../scoretable';

export default function RoundDetail() {
  const { id } = useParams<{ id: string }>();

  const [round, setRound] = useState<RoundType | null>(null);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const roundRes = await matchApiRequest.getRound(id);
        setRound(roundRes);
      } catch (error) {
        alert('Failed to fetch group detail');
      }
    };
    fetchRequest();
  }, [id]);
  const data = round;
  return (
    <div style={{ margin: '0% 10%' }}>
      <h1 className="text-3xl mb-4 mt-8 font-bold">Chi tiết trận đấu</h1>

      <div style={{ margin: '5% 20% 10%' }}>
        <ScoreTable data={data} />
      </div>
    </div>
  );
}
