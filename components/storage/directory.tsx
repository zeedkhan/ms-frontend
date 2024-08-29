"use client";

import { Directory as DirectoryType } from "@/types";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";
import { EllipsisVertical, ExternalLink, Folder, FolderPen, Info, Trash } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { EnhanceButton } from "@/components/ui/enhance-button";
import { ReactNode, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { UPLOAD_ROUTES } from "@/routes";
import { Input } from "@/components/ui/input";
import { useDrag } from "react-dnd";
import StorageStore from "@/state/storage";
import { useRouter } from "../loader/use-router";
import RemoveDirectory from "./remove-directory";

const RenameDirectory = ({ directory, children }: {
    directory: DirectoryType,
    children: ReactNode
}) => {
    const [curName, setCurName] = useState(directory.name);
    const directories = StorageStore((state) => state.directories);
    const { setDirectories } = StorageStore();

    const updateRoomName = async () => {
        try {
            await axios.put(`${UPLOAD_ROUTES.directory}/${directory.id}`, { name: curName });
            const updatedDirectories = directories.map((dir) => {
                if (dir.id === directory.id) {
                    return { ...dir, name: curName };
                }
                return dir;
            });
            setDirectories(updatedDirectories);
            toast.success("Directory name updated successfully");
        } catch (err) {
            console.error(err);
            toast.error("Failed! Please try again");
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Rename</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <Input
                        onChange={(e) => setCurName(e.target.value)}
                        value={curName}
                        id="name"
                    />
                </div>
                <DialogFooter>
                    <EnhanceButton
                        disabled={curName === directory.name}
                        onClick={updateRoomName}
                        size={"sm"}
                        className="text-xs"
                        variant={"gooeyRight"}
                        type="submit"
                    >
                        Save changes
                    </EnhanceButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
};

type DirectoryProps = {
    directory: DirectoryType;
    isOver: boolean;
};

const itemNameClass = "px-4 py-1 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer flex items-center justify-start space-x-4 transition"

const Directory: React.FC<DirectoryProps> = ({
    directory,
    isOver,
}) => {
    const selectIds = StorageStore((state) => state.selectIds);
    const onClick = StorageStore((state) => state.handleSelectIds);
    const toggleShowInfo = StorageStore((state) => state.setOpenFileInfo);
    const router = useRouter();
    const [open, setOpen] = useState(false);

    const [, dragRef] = useDrag({
        type: 'DIRECTORY',
        item: { ids: selectIds.ids, type: 'directory' },
        canDrag() {
            return selectIds.ids.length > 0 && selectIds.ids.includes(directory.id);
        },
    });

    const isSelectOrOver = isOver || (selectIds.type === "directory" && selectIds.ids.includes(directory.id));

    return (
        <Card
            onContextMenu={(e) => {
                e.preventDefault();
                setOpen(true);
            }}
            onDoubleClick={() => router.push(`/storage/${directory.id}`)}
            onClick={() => onClick("directory", directory.id)}
            ref={dragRef}
            key={directory.id}
            className={cn(
                "cursor-pointer w-60 truncate text-center font-bold h-12",
                "transition scale-100 duration-100 hover:scale-105",
                "flex justify-between items-center px-4",
                `${isSelectOrOver ? "bg-sky-200 dark:bg-gray-600" : ""}`,
            )}
        >
            <div className="flex space-x-4 items-center text-sm">
                <Folder size={18} />
                <p>{directory.name}</p>
            </div>

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild
                    onClick={(e) => e.stopPropagation()}

                >
                    <EllipsisVertical size={18} />
                </PopoverTrigger>
                <PopoverContent className="rounded-md text-sm p-0 py-1">
                    <div
                        className={cn(`flex flex-col space-y-2 w-full`,)}
                    >
                        <div
                            onClick={() => router.push(`/storage/${directory.id}`)}
                            className={cn(itemNameClass)}
                        >
                            <div className="w-5">
                                <ExternalLink size={18} />
                            </div>
                            <p>Open</p>
                        </div>

                        <RenameDirectory
                            directory={directory}
                        >
                            <div
                                className={cn(itemNameClass)}
                            >
                                <div className="w-5">
                                    <FolderPen size={18} />
                                </div>
                                <p>Rename</p>
                            </div>
                        </RenameDirectory>

                        <div
                            onClick={toggleShowInfo}
                            className={cn(itemNameClass)}
                        >
                            <div className="w-5">
                                <Info size={18} />
                            </div>
                            <p>Folder information</p>
                        </div>

                        <RemoveDirectory
                            directoryId={directory.id}
                        >
                            <div
                                className={cn(itemNameClass)}
                            >
                                <div className="w-5">
                                    <Trash size={18} />
                                </div>
                                <p>Remove</p>
                            </div>
                        </RemoveDirectory>

                    </div>
                </PopoverContent>
            </Popover>
        </Card>
    )
}


export default Directory;