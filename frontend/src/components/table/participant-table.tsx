'use client';
import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '../ui/scroll-area';
import { UserResType } from '@/schema/user';
import { useEffect, useMemo } from 'react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  showSearch?: boolean;
  showRowSelection?: boolean;
  updateForm: (ids: number[]) => void;
}

export function ParticipantsTable<TData, TValue>({
  columns,
  data,
  showSearch = false,
  showRowSelection = false,
  updateForm,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: handleRowSelectionChange,
    enableRowSelection: true,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  function handleRowSelectionChange(data: any) {
    setRowSelection(data);

    // setRowSelection
    const selectedIds = table.getFilteredSelectedRowModel().rows.map((row) => (row.original as UserResType).id);
    updateForm(selectedIds);
  }
  return (
    <div className="w-full">
      <div className="flex items-center py-2">
        {showSearch && (
          <Input
            placeholder="Tìm theo username .."
            value={(table.getColumn('username')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('username')?.setFilterValue(event.target.value)}
            className="max-w-sm"
          />
        )}
      </div>
      <ScrollArea className="mt-3 h-96 w-full relative rounded-md border">
        <Table className="relative">
          <TableHeader className="sticky top-0 bg-slate-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  onClick={row.getToggleSelectedHandler()}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Không có kết quả
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>
      <div className="flex items-center justify-end space-x-2 py-4">
        {showRowSelection && (
          <div className="flex-1 text-sm text-muted-foreground">
            Đã chọn {table.getFilteredSelectedRowModel().rows.length} trong {table.getFilteredRowModel().rows.length}{' '}
            thí sinh
          </div>
        )}
      </div>
    </div>
  );
}
