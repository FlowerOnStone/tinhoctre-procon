'use client';

import groupsApiRequest from '@/api/group';
import { GroupType } from '@/schema/group';
import { useEffect, useState } from 'react';
import { DataTable } from '@/components/table/general-table';
import { groupColumns } from './group-column';
import Link from 'next/link';
import { nameGroup } from '@/lib/const';
import { useAppContext } from '@/app/app-provider';
import { Button } from '@/components/ui/button';

export default function Groups({ id }: { id: string }) {
  const [groups, setGroups] = useState<GroupType[] | null>(null);
  const { user } = useAppContext();

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const groupsRes = await groupsApiRequest.getListGroups(id);
        setGroups(groupsRes.groups);
      } catch (error) {
        alert('Failed to fetch tournament detail');
      }
    };

    fetchRequest();
  }, [id]);
  console.log(groups);
  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl mb-4 mt-8 font-bold">Vòng bảng</h1>
        {user?.is_admin && groups?.length === 0 && (
          <Button size={'lg'}>
            <Link href={`${id}/group/create`}>Tạo vòng bảng</Link>
          </Button>
        )}
      </div>
      <div className="flex flex-wrap justify-around mb-[5%]">
        {groups?.map((group, index) => {
          const summary = group?.summary;
          const data = summary ? [summary['0'], summary['1'], summary['2']].filter((user) => user !== undefined) : [];
          console.log('data', summary);

          return (
            <div key={index} className="w-1/2 p-4">
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
