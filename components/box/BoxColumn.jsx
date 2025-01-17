"use client";

import { ColumnDef } from "@tanstack/react-table";
import Delete from "../custom ui/Delete";
import Link from "next/link";
import { ArrowUpDown } from "lucide-react";
import { Button } from "../ui/button";

export const columns = [
  {
    accessorKey: "box",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <Link href={`/box/${row.original._id}`} className="hover:text-red-1">
          {row.original.date}
        </Link>
      );
    },
  },
  {
    accessorKey: "boxCount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Box Count
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const boxItems = row.original.products;
      return (
        <div>{boxItems.map((product) => product.boxCount).join(", ")}</div>
      );
    },
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Quantity
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const boxItems = row.original.products;
      return (
        <div>{boxItems.map((product) => product.quantity).join(", ")}</div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <Delete item="box" id={row.original._id} />,
  },
];
