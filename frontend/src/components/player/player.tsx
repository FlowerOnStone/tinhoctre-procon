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


export type Player = {
    id: string
    name: string
    score: number
    time: string
  }

  
const data: Player[] = [
{
    id: "1",
    name: "Player One",
    score: 50,
    time: "10:00",
},
{
    id: "2",
    name: "Player Two",
    score: 40,
    time: "12:00",
},
{
    id: "3",
    name: "Player Three",
    score: 60,
    time: "14:00",
},
{
    id: "4",
    name: "Player Four",
    score: 30,
    time: "16:00",
},
{
    id: "5",
    name: "Player Five",
    score: 70,
    time: "18:00",
},
]
  

export const columns: ColumnDef<Player>[] = [
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
      header: "Họ tên",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "score",
      header: ({ column }) => {
        return (
          <div className="text-right">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Điểm số
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => {
        const score = parseFloat(row.getValue("score"))
  
        // Format the score
        const formatted = new Intl.NumberFormat("en-US", {
          style: "decimal",
        }).format(score)
  
        return <div className="text-right font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: "time",
      header: ({ column }) => {
        return (
          <div className="text-right">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Thời gian
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => (
        <div className="text-right">{row.getValue("time")}</div>
      ),
    },
    {
      id: "actions",
      header: () =>  <div className="text-right mr-3">Hành động</div>,
      enableHiding: false,
      cell: ({ row }) => {
        const player = row.original
  
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
                  onClick={() => navigator.clipboard.writeText(player.id)}
                >
                  Copy ID người chơi?
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Xem người chơi</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]
  