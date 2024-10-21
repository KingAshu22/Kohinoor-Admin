"use client";

import { ColumnDef } from "@tanstack/react-table";
import Delete from "../custom ui/Delete";
import Link from "next/link";
import { ArrowUpDown } from "lucide-react";
import { Button } from "../ui/button";

export const columns: ColumnDef<PackagingProductType>[] = [
  {
    accessorKey: "box",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const boxItems = row.original.box.filter((boxItem: any) => boxItem);
      return boxItems.length > 0 ? (
        <Link href={`/box/${row.original._id}`} className="hover:text-red-1">
          {boxItems.map((boxItem: any) => boxItem.date).join(", ")}
        </Link>
      ) : null;  // If no box items, render nothing
    },
  },
  {
    accessorKey: "boxCount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Box Count
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const boxItems = row.original.box.filter((boxItem: any) => boxItem);
      return boxItems.length > 0 ? (
        <div>{boxItems.map((boxItem: any) => boxItem.boxCount).join(", ")}</div>
      ) : null;  // If no box items, render nothing
    },
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Quantity
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const boxItems = row.original.box.filter((boxItem: any) => boxItem);
      return boxItems.length > 0 ? (
        <div>{boxItems.map((boxItem: any) => boxItem.quantity).join(", ")}</div>
      ) : null;  // If no box items, render nothing
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const boxItems = row.original.box.filter((boxItem: any) => boxItem);
      return boxItems.length > 0 ? <Delete item="box" id={row.original._id} /> : null;  // Only show actions if there are box entries
    },
  },
];
