'use client';

import groupsApiRequest from '@/api/group';
import { ScoreTable } from '@/components/group/score-table';
import { DetailGroupResType, GroupType } from '@/schema/group';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DetailGroup() {
  const { id } = useParams<{ id: string }>();

  const [group, setGroup] = useState<DetailGroupResType | null>(null);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const groupRes = await groupsApiRequest.getDetailGroup(id);
        setGroup(groupRes);
      } catch (error) {
        alert('Failed to fetch group detail');
      }
    };
    fetchRequest();
  }, [id]);

  return (
    <div style={{ margin: '0% 10%' }}>
      <h1 className="text-3xl mb-4 mt-8 font-bold">Chi tiết bảng A</h1>

      <div style={{ margin: '5% 20% 10%' }}>
        <ScoreTable></ScoreTable>
      </div>
    </div>
  );
}
