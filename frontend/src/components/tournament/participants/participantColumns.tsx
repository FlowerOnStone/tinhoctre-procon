import { ParticipantType } from '@/schema/group';
import { ColumnDef } from '@tanstack/react-table';

export const participantColumns: ColumnDef<ParticipantType>[] = [
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
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'first_name',
    header: 'Tên',
    cell: ({ row }) => (
      <div className="bg-white border-b border-gray-200 last:border-b-0">
        <div className="px-4 py-3">
          <div className="text-base font-medium text-gray-900">{row.getValue('first_name')}</div>
        </div>
      </div>
    ),
  },
];
