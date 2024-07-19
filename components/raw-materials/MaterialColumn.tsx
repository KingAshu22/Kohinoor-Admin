"use client";

import { ColumnDef } from "@tanstack/react-table";
import Delete from "../custom ui/Delete";
import Link from "next/link";
import { ArrowUpDown } from "lucide-react";
import { Button } from "../ui/button";

export const columns: ColumnDef<materialType>[] = [
  {
    accessorKey: "date",
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
    cell: ({ row }) => (
      <Link
        href={`/raw-material/${row.original._id}`}
        className="hover:text-red-1"
      >
        {row.original.date}
      </Link>
    ),
  },
  {
    accessorKey: "products",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Products
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const products = Array.from(
        new Set(row.original.products.map((product: any) => product.product))
      );
      return <div>{products.join(", ")}</div>;
    },
  },
  {
    accessorKey: "products",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Vendor
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const vendors = Array.from(
        new Set(row.original.products.map((product: any) => product.vendor))
      );
      return <div>{vendors.join(", ")}</div>;
    },
  },
  {
    accessorKey: "totalWeight",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total Weight
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const totalWeight = row.original.products.reduce(
        (acc: number, product: any) => acc + product.totalWeight,
        0
      );
      return <div>{totalWeight.toLocaleString("en-in")}</div>;
    },
  },
  {
    accessorKey: "pieces",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Pieces
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const pieces = row.original.products.reduce(
        (acc: number, product: any) => acc + product.pieces,
        0
      );
      return <div>{pieces.toLocaleString("en-in")}</div>;
    },
  },
  {
    accessorKey: "gross",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Gross
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const gross = row.original.products.reduce(
        (acc: number, product: any) => acc + product.gross,
        0
      );
      return <div>{gross.toLocaleString("en-in")}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <Delete item="raw-materials" id={row.original._id} />,
  },
];
