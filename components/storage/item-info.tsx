"use client";

import { useStore } from "zustand";
import { Card } from "../ui/card";
import StorageStore from "@/state/storage";
import { Directory, StorageFile } from "@/types";
import UseWindowSize from "@/hooks/use-window-size";
import { Folder, X } from "lucide-react";
import { File } from "../chat/message-file";
import { cn } from "@/lib/utils";

type FileInfoProps = Directory & StorageFile

const FileInfo = ({ item }: { item: FileInfoProps }) => {
    return (
        <div className="flex flex-col items-center space-y-2 px-4">
            {!item.url && <Folder size={28} />}

            {item.url && <File file={item} />}

            <div className="pt-2 text-center ">
                <p className="font-semibold">{item.name}</p>
                <ul>
                    {item.size && (
                        <li>
                            <span className="text-gray-500">Size:</span> {item.size}
                        </li>
                    )}
                    <li>
                        <span className="text-gray-500">Created at:</span> {item.createdAt}
                    </li>
                    <li>
                        <span className="text-gray-500">Last Modified:</span> {item.updatedAt}
                    </li>
                    <li>
                        <span className="text-gray-500">Owner</span> {item.userId}
                    </li>
                </ul>
            </div>
        </div>
    )
}

const ItemInfo = () => {
    const isShowInfo = useStore(StorageStore, (state) => state.openFileInfo);
    const ids = useStore(StorageStore, (state) => state.selectIds);
    const toggleShowInfo = StorageStore((state) => state.setOpenFileInfo);
    const lastItem = ids.ids[ids.ids.length - 1];
    const { isMobile } = UseWindowSize();

    const item = useStore(StorageStore, (state) => state.directories.find((dir) => dir.id === lastItem) || state.files.find((file) => file.id === lastItem));

    if (!isShowInfo || !item || isMobile) return null;

    return (
        <Card
            className="min-w-40 py-4 max-w-2xl"
        >
            <div
                className={cn(
                    ` dark:hover:text-gray-600 p-1 mx-2 hover:bg-gray-200 cursor-pointer w-fit rounded-full mb-4`,
                    `text-gray-600 dark:text-white dark:hover:bg-white`
                )}
            >
                <X size={18}
                    onClick={toggleShowInfo}
                />
            </div>
            <FileInfo item={item as FileInfoProps} />
        </Card>
    )
}

export default ItemInfo;