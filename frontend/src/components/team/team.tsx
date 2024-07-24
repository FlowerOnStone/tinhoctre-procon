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

export type Team = {
    id: string
    name: string
    members: number
    creationDate: string
  }

const teamData: Team[] = [
{
    id: "1",
    name: "Team Alpha",
    members: 10,
    creationDate: "2023-01-01",
},
{
    id: "2",
    name: "Team Beta",
    members: 15,
    creationDate: "2023-02-01",
},
{
    id: "3",
    name: "Team Gamma",
    members: 12,
    creationDate: "2023-03-01",
},
{
    id: "4",
    name: "Team Delta",
    members: 8,
    creationDate: "2023-04-01",
},
{
    id: "5",
    name: "Team Epsilon",
    members: 20,
    creationDate: "2023-05-01",
},
]

export const teamColumns: ColumnDef<Team>[] = [
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
      accessorKey: "name",
      header: "Tên đội",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "members",
      header: ({ column }) => {
        return (
          <div className="text-right">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Số thành viên
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => {
        const members = parseFloat(row.getValue("members"))
  
        // Format the members
        const formatted = new Intl.NumberFormat("en-US", {
          style: "decimal",
        }).format(members)
  
        return <div className="text-right font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: "creationDate",
      header: ({ column }) => {
        return (
          <div className="text-right">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Ngày tạo
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => (
        <div className="text-right">{row.getValue("creationDate")}</div>
      ),
    },
    {
      id: "actions",
      header: () =>  <div className="text-right mr-3">Hành động</div>,
      enableHiding: false,
      cell: ({ row }) => {
        const team = row.original
  
        return (
          <div className="text-right mr-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Xem thêm</span>
                  <DotsHorizontalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(team.id)}
                >
                  Copy ID đội?
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Xem đội</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
]