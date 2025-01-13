"use client";

import { ColumnDef } from "@tanstack/react-table";
import Delete from "../custom ui/Delete";
import Link from "next/link";
import { ArrowUpDown } from "lucide-react";
import { Button } from "../ui/button";

export const columns = [
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
        cell: ({ row }) => {
            const date = new Date(row.original.date); // Convert to Date object
            if (isNaN(date)) {
                return <div>Invalid Date</div>; // Handle invalid date gracefully
            }
            return <a href={`/return/${row.original._id}`}>{date.toLocaleDateString()}</a>;
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
                    Products
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const products = Array.from(
                new Set(row.original.entries.map((product) => product.product))
            );
            return <div>{products.join(", ")}</div>;
        },
    },
    {
        accessorKey: "vendor",
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
            const products = Array.from(
                new Set(row.original.entries.map((product) => product.vendor))
            );
            return <div>{products.join(", ")}</div>;
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <Delete item="return" id={row.original._id} />,
    },
];
