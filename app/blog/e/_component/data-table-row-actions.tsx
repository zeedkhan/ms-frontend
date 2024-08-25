"use client"

import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Row } from "@tanstack/react-table"
import {
    DropdownMenu, DropdownMenuContent,
    DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Blog } from "@/types"
import { useRouter } from "@/components/loader/use-router"
import { deleteBlog } from "@/db/blog"
import { toast } from "sonner"
import { useStore } from "zustand"
import { BlogStore } from "@/state/blog"


interface DataTableRowActionsProps<TData> {
    row: Row<TData>;
}

export function DataTableRowActions<TData>({
    row,
}: DataTableRowActionsProps<TData>) {
    const { original } = row;
    const blog = JSON.parse(JSON.stringify(original)) as Blog;
    const router = useRouter();
    const removeBlog = useStore(BlogStore, (state) => state.removeBlog);


    const DeleteBlog = async () => {
        if (blog.id) {
            const response = await deleteBlog(blog.id);
            toast.success("Blog deleted!");
            removeBlog(blog.id);
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                >
                    <DotsHorizontalIcon className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuItem
                    className="cursor-pointer"
                    onSelect={() => router.push(`/blog/e/${blog.id}`)}
                >
                    Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="cursor-pointer"
                    onSelect={DeleteBlog}
                >
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}