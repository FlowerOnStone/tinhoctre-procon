"use client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ColumnDef } from "@tanstack/react-table"

import { ArrowUpDown } from "lucide-react"

import { DotsHorizontalIcon } from "@radix-ui/react-icons"

// Define the Group type
export type Group = {
  id: string
  name: string
  win: number
  draw: number
  lose: number
  difference: number
}

// Sample data for groups
const data: Group[] = [
  {
    id: "1",
    name: "Team One",
    win: 2,
    draw: 0,
    lose: 0,
    difference: 50,
  },
  {
    id: "2",
    name: "Team Two",
    win: 1,
    draw: 0,
    lose: 1,
    difference: 20,
  },
  {
    id: "3",
    name: "Team Three",
    win: 0,
    draw: 0,
    lose: 2,
    difference: -70,
  },
]

// Define the column structure for the table
export const columns: ColumnDef<Group>[] = [
  {
    accessorKey: "name",
    header: "Tên người chơi",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "win",
    header: ({ column }) => (
      <div className="text-right">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Thắng
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      return <div className="text-right font-medium">{row.getValue("win")}</div>
    },
  },
  {
    accessorKey: "draw",
    header: ({ column }) => (
      <div className="text-right">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Hòa
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      return <div className="text-right font-medium">{row.getValue("draw")}</div>
    },
  },
  {
    accessorKey: "lose",
    header: ({ column }) => (
      <div className="text-right">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Thua
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      return <div className="text-right font-medium">{row.getValue("lose")}</div>
    },
  },
  {
    accessorKey: "difference",
    header: ({ column }) => (
      <div className="text-right">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Hiệu số
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      return <div className="text-right font-medium">{row.getValue("difference")}</div>
    },
  },
//   {
//     id: "actions",
//     header: () => <div className="text-right mr-3">Actions</div>,
//     enableHiding: false,
//     cell: ({ row }) => {
//       const group = row.original
//       return (
//         <div className="text-right mr-3">
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" className="h-8 w-8 p-0">
//                 <span className="sr-only">View more</span>
//                 <DotsHorizontalIcon className="h-4 w-4" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuLabel>Actions</DropdownMenuLabel>
//               <DropdownMenuItem
//                 onClick={() => navigator.clipboard.writeText(group.id)}
//               >
//                 Copy Group ID
//               </DropdownMenuItem>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem>View Group</DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       )
//     },
//   },
]
