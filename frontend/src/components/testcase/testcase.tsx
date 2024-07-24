"use client"
import React, {useState} from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";


import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter
} from "@/components/ui/dialog"



import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import TestCaseForm from './testcaseform';
import TestCaseEditor from './testcaseeditor';


export type TestCase = {
  id: string;
  zipFile?: File;
  grader: string;
  ioMethod: string;
  marker: string;
  outputLimit: string;
};

const testCaseData: TestCase[] = [
  {
    id: "1",
    zipFile: undefined,
    grader: "Grader Alpha",
    ioMethod: "Method A",
    marker: "Marker X",
    outputLimit: "10 MB",
  },
  {
    id: "2",
    zipFile: undefined,
    grader: "Grader Beta",
    ioMethod: "Method B",
    marker: "Marker Y",
    outputLimit: "15 MB",
  },
  {
    id: "3",
    zipFile: undefined,
    grader: "Grader Gamma",
    ioMethod: "Method C",
    marker: "Marker Z",
    outputLimit: "12 MB",
  },
  {
    id: "4",
    zipFile: undefined,
    grader: "Grader Delta",
    ioMethod: "Method D",
    marker: "Marker W",
    outputLimit: "8 MB",
  },
  {
    id: "5",
    zipFile: undefined,
    grader: "Grader Epsilon",
    ioMethod: "Method E",
    marker: "Marker V",
    outputLimit: "20 MB",
  },
];

export const columnsTestCase: ColumnDef<TestCase>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
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
      accessorKey: "grader",
      header: "Grader",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("grader")}</div>
      ),
    },
    {
      accessorKey: "ioMethod",
      header: "IO Method",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("ioMethod")}</div>
      ),
    },
    {
      accessorKey: "marker",
      header: "Marker",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("marker")}</div>
      ),
    },
    {
      accessorKey: "outputLimit",
      header: "Output Limit",
      cell: ({ row }) => (
        <div>{row.getValue("outputLimit")}</div>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right mr-3">Actions</div>,
      enableHiding: false,
      cell: ({ row }) => {
        const testCase = row.original;
        const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
        const [isDeleteAlertDialogOpen, setIsDeleteAlertDialogOpen] = useState<boolean>(false);

        const handleDelete = (): void => {
          console.log('Item deleted');
          setIsDeleteAlertDialogOpen(false);
        };


        return (
          <div className="text-right mr-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">More options</span>
                  <DotsHorizontalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(testCase.id)}
                >
                  Copy ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>Xem và chỉnh sửa</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsDeleteAlertDialogOpen(true)} style = {{color: 'red'}}>Xóa test case</DropdownMenuItem>
              </DropdownMenuContent>
              

              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogTrigger asChild>
                  <button style={{ display: 'none' }}></button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>Thông tin chi tiết</DialogTitle>
                  <DialogDescription>
                    Xem và thiết lập các chỉnh sửa trong test case ở đây. Chọn Lưu để lưu chỉnh sửa
                  </DialogDescription>
                    <TestCaseEditor data={testCase}></TestCaseEditor>
                    <DialogFooter>
                      <Button onClick={() => setIsEditDialogOpen(false)} style={{backgroundColor: '#2084bc'}}>Lưu</Button>
                      <Button variant="ghost" onClick={() => setIsEditDialogOpen(false)}>Hủy</Button>
                    </DialogFooter>
                </DialogContent>
              </Dialog>


              <AlertDialog open={isDeleteAlertDialogOpen} onOpenChange={setIsDeleteAlertDialogOpen}>
                <AlertDialogTrigger asChild>
                  <button style={{ display: 'none' }}></button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                  <AlertDialogDescription>
                    Bạn có chắc chắn muốn xóa test case này không? Hành động này không thể hoàn tác.
                  </AlertDialogDescription>
                  <AlertDialogFooter>
                    <AlertDialogAction style={{backgroundColor:"#d02434"}} onClick={handleDelete}>
                      Xóa
                    </AlertDialogAction>
                    <AlertDialogCancel onClick={() => setIsDeleteAlertDialogOpen(false)}>
                      Hủy
                    </AlertDialogCancel>
                  </AlertDialogFooter>
                  
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

