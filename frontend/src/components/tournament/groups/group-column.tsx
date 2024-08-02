import { Button } from '@/components/ui/button';
import { UserInGroupType } from '@/schema/group';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

// Define the column structure for the table
export const groupColumns: ColumnDef<UserInGroupType>[] = [
  {
    accessorKey: 'name',
    header: 'Tên thí sinh',
    cell: ({ row }) => <div className="capitalize">{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'win',
    header: ({ column }) => (
      <div className="text-right">
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Thắng
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      return <div className="text-right font-medium">{row.getValue('win')}</div>;
    },
  },
  {
    accessorKey: 'draw',
    header: ({ column }) => (
      <div className="text-right">
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Hòa
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      return <div className="text-right font-medium">{row.getValue('draw')}</div>;
    },
  },
  {
    accessorKey: 'lose',
    header: ({ column }) => (
      <div className="text-right">
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Thua
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      return <div className="text-right font-medium">{row.getValue('lose')}</div>;
    },
  },
  {
    accessorKey: 'point',
    header: ({ column }) => (
      <div className="text-right">
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Điểm
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      return <div className="text-right font-medium">{row.getValue('point')}</div>;
    },
  },
  {
    accessorKey: 'num_round',
    header: 'Số vòng',
    cell: ({ row }) => <div className="text-right">{row.getValue('num_round')}</div>,
  },
];
