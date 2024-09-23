"use client";

import { ColumnDef } from "@tanstack/react-table";
import Delete from "../custom ui/Delete";
import Link from "next/link";
import { ArrowUpDown } from "lucide-react";
import { Button } from "../ui/button";

export const columns: ColumnDef<VendorType>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <Link href={`/vendors/${row.original._id}`} className="hover:text-red-1">
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <>
        <Delete item="vendors" id={row.original._id} />
        <Link href={`/vendors/entry/${row.original._id}`} passHref>
          <Button className="bg-yellow-600 text-white ml-4 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
            Entry
          </Button>
        </Link>
        <Link href={`/vendors/salary/${row.original._id}`} passHref>
          <Button className="bg-green-600 text-white ml-4 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
            Salary
          </Button>
        </Link>
      </>
    ),
  },
];
