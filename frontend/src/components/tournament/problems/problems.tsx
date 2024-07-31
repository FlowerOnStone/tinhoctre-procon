'use client';

import { DataTable } from '@/components/table/generaltable';
import { ColumnDef } from '@tanstack/react-table';
import React from 'react';

const data = [
  { id: 1, name: 'Dãy số', points: 100 },
  { id: 2, name: 'Tam giác', points: 100 },
  { id: 3, name: 'Hàng cây', points: 100 },
];

type Problem = {
  id: number;
  name: string;
  points: number;
};

const columns: ColumnDef<Problem>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => <div>{row.getValue('id')}</div>,
  },
  {
    accessorKey: 'name',
    header: 'Problem',
    cell: ({ row }) => <div>{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'points',
    header: 'Points',
    cell: ({ row }) => <div>{row.getValue('points')}</div>,
  },
];

export default function Problems() {
  return <DataTable data={data} columns={columns}></DataTable>;
}
