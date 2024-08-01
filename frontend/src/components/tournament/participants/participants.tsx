import { DataTable } from '@/components/table/generaltable';
import React from 'react';
import { participantColumns } from './participantColumns';

export default function ParticipantsPage() {
  const data = [
    {
      id: '1',
      username: 'user1',
      fullName: 'User One',
      points: 100,
      problemsCount: 10,
    },
    {
      id: '2',
      username: 'user2',
      fullName: 'User Two',
      points: 90,
      problemsCount: 9,
    },
    {
      id: '3',
      username: 'user3',
      fullName: 'User Three',
      points: 80,
      problemsCount: 8,
    },
    {
      id: '4',
      username: 'user4',
      fullName: 'User Four',
      points: 70,
      problemsCount: 7,
    },
  ];

  return <DataTable data={data} columns={participantColumns}></DataTable>;
}
