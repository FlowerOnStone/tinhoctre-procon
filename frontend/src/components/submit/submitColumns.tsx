import { ColumnDef } from '@tanstack/react-table';
import { SubmissionStatus, SubmissionType } from '@/schema/submission';

export const submitColumns: ColumnDef<SubmissionType>[] = [
  {
    accessorKey: 'id',
    header: 'Thứ tự',
    cell: ({ row }) => <div className="capitalize">{row.getValue('id')}</div>,
  },
  {
    accessorKey: 'user',
    header: 'Thí sinh',
    cell: ({ row }) => <div className="capitalize">{row.getValue('user')}</div>,
  },
  {
    accessorKey: 'language',
    header: 'Ngôn ngữ',
    cell: ({ row }) => <div className="capitalize">{row.getValue('language')}</div>,
  },
  {
    accessorKey: 'status',
    header: 'Trạng thái',
    cell: ({ row }) => <div>{SubmissionStatus[row.getValue('status') as keyof typeof SubmissionStatus]}</div>,
  },
];
