'use client';

import matchApiRequest from '@/api/match';
import { RoundType } from '@/schema/match';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ScoreTable } from '../scoretable';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function RoundDetail() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [round, setRound] = useState<RoundType | null>(null);

  const createMatch = async () => {
    try {
      const matchRes = await matchApiRequest.createMatch(id);
      console.log('Match created', matchRes);
      router.replace(`/statusbar/${matchRes.match.id}`)
    } catch (error) {
      console.log('Failed to create match')
    }
  }

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const roundRes = await matchApiRequest.getRound(id);
        setRound(roundRes);
      } catch (error) {
        console.log('Failed to fetch group detail');
      }
    };
    fetchRequest();
  }, [id]);
  const data = round;
  // console.log('current data', data?.matchs.length!==undefined && data?.round.num_match!==undefined && data?.matchs.length < data?.round.num_match)
  return (
    <div style={{ margin: '0% 10%' }}>
      <div className='flex justify-between items-center'>
        <h1 className="text-3xl font-bold">Chi tiết trận đấu</h1>
        {data?.matchs.length!==undefined && data?.round.num_match!==undefined && data?.matchs.length < data?.round.num_match ? <Button onClick={()=>createMatch()} className='bg-[#1C81BA]'>Thêm trận đấu</Button> : <></>}
      </div>
      <div style={{ margin: '5% 20% 10%' }}>
        <ScoreTable data={data} />
      </div>
    </div>
  );
}
