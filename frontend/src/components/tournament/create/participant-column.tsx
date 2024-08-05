import { Checkbox } from '@/components/ui/checkbox';
import { UserResType } from '@/schema/user';
import { ColumnDef } from '@tanstack/react-table';

export const participantColumns: ColumnDef<UserResType>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'username',
    header: 'Username',
    cell: ({ row }) => <div className="capitalize">{row.getValue('username')}</div>,
  },
  {
    accessorKey: 'first_name',
    header: 'Tên',
    cell: ({ row }) => <div className="capitalize">{row.getValue('first_name')}</div>,
  },
];
