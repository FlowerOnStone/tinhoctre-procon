"use client"
import React from 'react';
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

export type TestCase = {
  id: string;
  zipFile?: string;
  grader: string;
  ioMethod: string;
  marker: string;
  outputLimit: string;
};

const testCaseData: TestCase[] = [
  {
    id: "1",
    grader: "Grader Alpha",
    ioMethod: "Method A",
    marker: "Marker X",
    outputLimit: "10 MB",
  },
  {
    id: "2",
    grader: "Grader Beta",
    ioMethod: "Method B",
    marker: "Marker Y",
    outputLimit: "15 MB",
  },
  {
    id: "3",
    grader: "Grader Gamma",
    ioMethod: "Method C",
    marker: "Marker Z",
    outputLimit: "12 MB",
  },
  {
    id: "4",
    grader: "Grader Delta",
    ioMethod: "Method D",
    marker: "Marker W",
    outputLimit: "8 MB",
  },
  {
    id: "5",
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
                <DropdownMenuItem>View Details</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

