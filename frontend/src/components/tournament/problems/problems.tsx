'use client';

import { DataTable } from '@/components/table/general-table';
import { useEffect, useState } from 'react';
import { problemColumns } from './problemColumns';
import { ProblemType } from '@/schema/problem';
import tournamentApiRequest from '@/api/tournament';

export default function Problems({ id }: { id: string }) {
  const [problems, setProblems] = useState<ProblemType | null>(null);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const problemsRes = await tournamentApiRequest.getProblemsByTournament(id);
        setProblems(problemsRes.problem);
      } catch (error) {
        alert('Failed to fetch tournament detail');
      }
    };
    fetchRequest();
  }, [id]);
  const data = problems ? [problems] : [];
  return <DataTable data={data} columns={problemColumns} problemsTable />;
}
