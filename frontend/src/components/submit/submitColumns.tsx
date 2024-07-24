'use client';
import React, { useState } from 'react';

import { ColumnDef } from '@tanstack/react-table';

export type Submit = {
  id: string;
  name: string;
  grade: string;
  time: string;
};

export const submitColumns: ColumnDef<Submit>[] = [
  {
    accessorKey: 'id',
    header: 'Thứ tự',
    cell: ({ row }) => <div className="capitalize">{row.getValue('id')}</div>,
  },
  {
    accessorKey: 'name',
    header: 'Họ và tên',
    cell: ({ row }) => <div className="capitalize">{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'grade',
    header: 'Điểm',
    cell: ({ row }) => <div className="capitalize">{row.getValue('grade')}</div>,
  },
  {
    accessorKey: 'time',
    header: 'Thời gian',
    cell: ({ row }) => <div>{row.getValue('time')}</div>,
  },
];
