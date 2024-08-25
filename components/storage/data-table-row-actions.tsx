"use client"

import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Row } from "@tanstack/react-table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useRouter } from "@/components/loader/use-router"
import { toast } from "sonner"
import StorageStore from "@/state/storage"
import { useMemo } from "react"
import { deleteDirectory } from "@/db/directory"
import { deleteStorageFile } from "@/db/storage"
import { useSearchParams } from "next/navigation"

interface DataTableRowActionsProps<TData> {
    row: Row<TData>;
}

export function DataTableRowActions<TData>({
    row,
}: DataTableRowActionsProps<TData>) {
    const router = useRouter();
    const { setFiles, setDirectories, directories, files } = StorageStore();
    const object = JSON.parse(JSON.stringify(row.original)) as any;
    const searchParams = useSearchParams();

    const isDirectory = useMemo(() => {
        if (!object) return false;
        return directories.find((d) => d.id === object.id) ? true : false;
    }, [directories, object]);

    const isFile = useMemo(() => {
        if (!object) return false;
        return files.find((d) => d.id === object.id) ? true : false;
    }, [files, object]);

    const DeleteBlog = async () => {
        if (isDirectory) {
            await deleteDirectory(object.id);
            setDirectories(directories.filter((d) => d.id !== object.id));
            toast.success("Directory deleted successfully");

        } else if (isFile) {
            await deleteStorageFile(object.id);
            setFiles(files.filter((f) => f.id !== object.id));
            toast.success("File deleted successfully");
        } else {
            toast.error("Something went wrong");
        }
    };

    const changeRoute = () => {
        if (isDirectory) {
            router.push(`/storage/${object.id}?${searchParams}`);
        } else if (isFile) {
            router.push(`/file/${object.id}`);
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
                    onSelect={changeRoute}
                >
                    Open
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