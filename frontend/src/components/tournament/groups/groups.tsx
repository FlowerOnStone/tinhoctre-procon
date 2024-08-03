'use client';

import groupsApiRequest from '@/api/group';
import { GroupType } from '@/schema/group';
import { useEffect, useState } from 'react';
import { DataTable } from '@/components/table/general-table';
import { groupColumns } from './group-column';
import Link from 'next/link';
import { nameGroup } from '@/lib/const';

export default function Groups({ id }: { id: string }) {
  const [groups, setGroups] = useState<GroupType[] | null>(null);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const groupsRes = await groupsApiRequest.getListGroups(id);
        const demo = [groupsRes.groups[0]];
        setGroups(demo);
      } catch (error) {
        alert('Failed to fetch tournament detail');
      }
    };
    fetchRequest();
  }, [id]);

  return (
    <>
      <h1 className="text-3xl mb-4 mt-8 font-bold">Vòng bảng</h1>
      <div className="flex justify-around mb-[5%]">
        {groups?.map((group, index) => {
          const data = [group.summary.user1, group.summary.user2, group.summary.user3];
          return (
            <div key={index} className="w-1/2">
              <h2 className="text-center w-full hover:bg-[#14518B] hover:text-white text-2xl font-bold transition duration-300">
                <Link href={`/group/${group.id}`}>Bảng {nameGroup[index]}</Link>
              </h2>
              <DataTable data={data} columns={groupColumns} />
            </div>
          );
        })}
      </div>
    </>
  );
}
