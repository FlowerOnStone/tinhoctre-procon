'use client';
import React from 'react';

import { ColumnDef } from '@tanstack/react-table';

export type Participants = {
  id: string;
  username: string;
  fullName: string;
  points: number;
  problemsCount: number;
};

export const participantColumns: ColumnDef<Participants>[] = [
  {
    accessorKey: 'id',
    header: 'Thứ tự',
    cell: ({ row }) => <div className="capitalize">{row.getValue('id')}</div>,
  },
  {
    accessorKey: 'username',
    header: 'Username',
    cell: ({ row }) => (
      <div className="bg-white border-b border-gray-200 last:border-b-0">
        <div className="px-4 py-3">
          <div className="text-sm text-gray-600">{row.getValue('username')}</div>
          <div className="text-base font-medium text-gray-900">{row.getValue('fullName')}</div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'points',
    header: 'Điểm',
    cell: ({ row }) => <div className="capitalize">{row.getValue('points')}</div>,
  },
  {
    accessorKey: 'problemsCount',
    header: 'Số bài đã nộp',
    cell: ({ row }) => <div>{row.getValue('problemsCount')}</div>,
  },
];
