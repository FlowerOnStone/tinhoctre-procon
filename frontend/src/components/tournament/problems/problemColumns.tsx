'use client';
import React from 'react';

import { ColumnDef } from '@tanstack/react-table';
import { ProblemType } from '@/schema/problem';

export const problemColumns: ColumnDef<ProblemType>[] = [
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
    accessorKey: 'time_limit',
    header: 'Time Limit',
    cell: ({ row }) => <div>{row.getValue('time_limit')}</div>,
  },
  {
    accessorKey: 'memory_limit',
    header: 'Memory Limit',
    cell: ({ row }) => <div>{row.getValue('memory_limit')}</div>,
  },
  {
    accessorKey: 'allow_language',
    header: 'Allow Language',
    cell: ({ row }) => <div>{row.getValue('allow_language')}</div>,
  },
  {
    accessorKey: 'public_visible',
    header: 'Public Visible',
    cell: ({ row }) => <div>{row.getValue('public_visible')}</div>,
  },
  {
    accessorKey: 'creator',
    header: 'Creator',
    cell: ({ row }) => <div>{row.getValue('creator')}</div>,
  },
  {
    accessorKey: 'body',
    header: 'Body',
    cell: ({ row }) => <div>{row.getValue('body')}</div>,
  },
  {
    accessorKey: 'pdf',
    header: 'PDF',
    cell: ({ row }) => <div>{row.getValue('pdf')}</div>,
  },
];
