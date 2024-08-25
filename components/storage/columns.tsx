"use client"

import { ColumnDef } from "@tanstack/react-table"
import { z } from "zod"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-column-herder"
import { DataTableRowActions } from "./data-table-row-actions"
import Link from "next/link"

export const objectSchema = z.object({
    id: z.string(),
    title: z.string(),
    type: z.enum(["directory", "file"]),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
})

export type Object = z.infer<typeof objectSchema>;

export const columns: ColumnDef<Object>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <div className="pl-2">
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                    className="translate-y-[2px]"
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className="pl-2">
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                    className="translate-y-[2px]"
                />
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "title",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Title" className="pl-2" />
        ),
        cell: ({ row }) => {
            const searchParam = new URLSearchParams(window.location.search);
            const nextUrl = row.original.type === "directory" ? `/storage/${row.original.id}?${searchParam.toString()}` : `/file/${row.original.id}`;
            return (
                <Link
                    href={nextUrl}
                    className="w-[200px] pl-2">{row.getValue("title")}
                </Link>
            )
        },
    },
    {
        accessorKey: "updatedAt",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Updated At" />
        ),
        cell: ({ row }) => <div className="w-[200px]">{row.getValue("updatedAt")}</div>,
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Created At" />
        ),
        cell: ({ row }) => <div className="w-[200px]">{row.getValue("createdAt")}</div>,
    },
    {
        id: "actions",
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
]