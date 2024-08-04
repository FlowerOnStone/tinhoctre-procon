import { ColumnDef } from '@tanstack/react-table';
import { ProblemsResType } from '@/schema/problem';

export const problemsColumns: ColumnDef<ProblemsResType>[] = [
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
    accessorKey: 'public_visible',
    header: 'Public Visible',
    cell: ({ row }) => <div>{row.getValue('public_visible')}</div>,
  },
];
