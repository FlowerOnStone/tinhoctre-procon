'use client';

import groupsApiRequest from '@/api/group';
import { ScoreTable } from '@/components/group/score-table';
import { DataTable } from '@/components/table/general-table';
import { groupColumns } from '@/components/tournament/groups/group-column';
import { DetailGroupResType } from '@/schema/group';
import { ChevronLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DetailGroup() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

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
  const data = group?.summary
    ? [group.summary['0'], group.summary['1'], group.summary['2']].filter((user) => user !== undefined)
    : [];

  const handleBack = () => {
    router.back();
  };

  return (
    <div>
      <div className="flex gap-2 items-center mb-8 mt-4">
        <ChevronLeft className="h-8 w-8" onClick={handleBack} />
        <h1 className="text-3xl font-bold">Chi tiết bảng thi đấu</h1>
      </div>
      <h1 className="text-2xl font-bold mb-10" style={{ textAlign: 'center' }}>
        Tổng quan
      </h1>
      <DataTable data={data} columns={groupColumns}></DataTable>

      <div style={{ margin: '5% 20% 10%' }}>
        <ScoreTable data={group} />
      </div>
    </div>
  );
}
