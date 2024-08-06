'use client';

import React, { useEffect, useState } from 'react';
import { RoundResType } from '@/schema/match';
import matchApiRequest from '@/api/match';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export default function RoundsPage() {
  const [rounds, setRounds] = useState<RoundResType[]>([]);
  const route = useRouter();

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const roundRes = await matchApiRequest.getAllRound();
        setRounds(roundRes.rounds);
      } catch (error) {
        console.log('Failed to fetch group detail');
      }
    };
    fetchRequest();
  }, []);

  return (
    <div className="flex items-center flex-col w-full">
      <h1 className="text-3xl mb-4 mt-8 font-bold">Danh sách vòng đấu</h1>
      <div className="min-w-[1000px] mx-auto">
        <Table>
          <TableBody>
            {rounds.map((round, index) => (
              <TableRow
                key={round.id}
                onClick={() => route.push(`/round/${round.id}/`)}
                className="cursor-pointer hover:bg-[#14518B] transition duration-300 text-black hover:text-white flex"
              >
                <TableCell
                  className={`${round.status === 'F' ? 'hover:text-white' : 'text-gray-400 hover:text-white'} ${
                    round.status === 'F' ? 'hover:font-bold' : ''
                  } flex-1`}
                >
                  {round.first_user.first_name}
                </TableCell>
                <TableCell className="text-center hover:text-white flex-1">
                  {round.status === 'N' ? 'Chưa thi đấu' : `${round.first_score} - ${round.second_score}`}
                </TableCell>
                <TableCell
                  className={`text-right ${
                    round.status === 'S' ? 'hover:text-white' : 'text-gray-400 hover:text-white'
                  } ${round.status === 'S' ? 'hover:font-bold' : ''} flex-1`}
                >
                  {round.second_user.first_name}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
