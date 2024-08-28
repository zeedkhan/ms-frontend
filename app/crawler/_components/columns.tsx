"use client"

import { ColumnDef } from "@tanstack/react-table"
import { z } from "zod"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-column-herder"
// import { DataTableRowActions } from "./data-table-row-actions"

export const objectSchema = z.object({
    id: z.number(),
    title: z.string(),
    integrations: z.array(z.object({
        key: z.string(),
        name: z.string(),
        value: z.boolean()
    }))
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
            return (
                <div
                    className="w-[200px] pl-2">{row.getValue("title")}
                </div>
            )
        },
    },
    {
        accessorKey: "integrations",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Integrations" className="pl-2" />
        ),
        cell: ({ row }) => {
            return (
                <div
                    className="w-[200px] pl-2">{row.getValue("title")}
                </div>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <></>
    },
]