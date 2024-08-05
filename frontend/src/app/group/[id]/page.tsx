'use client';

import groupsApiRequest from '@/api/group';
import { ScoreTable } from '@/components/group/score-table';
import { DataTable } from '@/components/table/general-table';
import { groupColumns } from '@/components/tournament/groups/group-column';
import { nameGroup } from '@/lib/const';
import { DetailGroupResType } from '@/schema/group';
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
  const data = group?.summary ? [group.summary['0'], group.summary['1'], group.summary['2']].filter(user => user !== undefined) : [];
  return (
    <div style={{ margin: '0% 10%' }}>
      <h1 className="text-3xl mb-4 mt-8 font-bold">Chi tiết bảng thi đấu</h1>
      <h1 className="text-2xl font-bold mb-10" style={{ textAlign: 'center' }}>Tổng quan</h1>
      <DataTable data={data} columns={groupColumns}></DataTable>

      <div style={{ margin: '5% 20% 10%' }}>
        <ScoreTable data={group} />
      </div>
    </div>
  );
}
