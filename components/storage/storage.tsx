"use client";

import UploadPopover from "./upload-popover";
import { useEffect, useState } from "react";
import Search from "./search";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DroppableDirectoryContainer } from "./droppable-directory";
import { DraggableFilesContainer } from "./draggable-items";
import CustomDragLayer from "./custom-drag-layer";
import { getUserStorageWithNoDirectory, moveDirectory, moveStorageFilesToDirectory } from "@/db/storage";
import { toast } from "sonner";
import StorageStore from "@/state/storage";
import { getDirectoryId, getUserDirectory } from "@/db/directory";
import { useSession } from "next-auth/react";
import { usePathname, useSearchParams } from "next/navigation";
import Filter from "./filter";
import { cn } from "@/lib/utils";
import { Card } from "../ui/card";
import CustomBreadCrumb from "../custom-bread-crumb";
import ListView from "./list-view";

type Item = "file" | "directory";

const Storage: React.FC = () => {
    const session = useSession();
    const { setDirectories, setFiles, setParentId, setName, setSelectIds } = StorageStore();
    const directories = StorageStore((state) => state.directories);
    const files = StorageStore((state) => state.files);
    const pathname = usePathname();
    const [routes, setRoutes] = useState<{ title: string, url: string }[]>([{ title: "Home", url: "/storage" }]);

    const searchParam = useSearchParams();

    useEffect(() => {
        const getData = async () => {
            if (!session.data?.user) return;
            const directoryId = pathname.split("/").pop();
            if (directoryId === "storage") {
                const files = await getUserStorageWithNoDirectory(session.data.user.id);
                const diretories = await getUserDirectory(session.data.user.id);
                setDirectories(diretories);
                // Hard code for the root directory
                setName("Welcome to Storage");
                setFiles(files);
                return;
            }
            if (directoryId) {
                const directory = await getDirectoryId(directoryId);
                if (directory) {
                    setParentId(directory.parentId || null);
                    const r = [{ title: "Home", url: "/storage" }];
                    if (directory.parentId) {
                        r.push({ title: directory.parentId, url: `/storage/${directory.parentId}` });
                    }
                    setRoutes([
                        ...r,
                        { title: directory.name, url: `/storage/${directory.id}` }
                    ]);
                    setDirectories(directory.children || []);
                    setName(directory.name);
                    setFiles(directory.files || []);
                }
            }
        }
        getData();
    }, []);

    const moveStorage = async (items: { ids: string[], type: Item }, directoryId: string) => {
        const objectToMoveIds = items.ids;
        try {
            const update = await moveStorageFilesToDirectory({ directoryId, ids: objectToMoveIds });
            if (update.error) {
                toast.error(update.error);
                return;
            }
            setFiles(files.filter((f) => !objectToMoveIds.includes(f.id)));
            toast.success(update.success);
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong!");
        }
        setSelectIds({ type: "file", ids: [] });
    }

    const moveDirectoies = async (items: { ids: string[], type: Item }, directoryId: string) => {
        const objectToMoveIds = items.ids;
        try {
            const update = await moveDirectory({ directoryId, ids: objectToMoveIds });
            if (update.error) {
                toast.error(update.error);
                return;
            }
            const dis = directories.filter((d) => !objectToMoveIds.includes(d.id));
            setDirectories(dis);
            toast.success(update.success);
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong!");
        }
        setSelectIds({ type: "file", ids: [] });
    }

    const handleDrop = async (items: { ids: string[], type: Item }, directoryId: string) => {
        // Handle the logic to move the file or directory to the target directory
        if (items.type === "file") {
            await moveStorage(items, directoryId);
            return;
        };

        if (items.type === "directory") {
            await moveDirectoies(items, directoryId);
            return;
        }
    };

    return (
        <Card>
            <div className={cn(
                `p-4`
            )}>
                <CustomBreadCrumb
                    routes={routes}
                />
                <Search />
                <Filter />
                {
                    searchParam.get("view") === "list" ? <ListView /> : (
                        <DndProvider
                            backend={HTML5Backend}
                        >
                            <DroppableDirectoryContainer
                                handleDrop={handleDrop}
                            />
                            <DraggableFilesContainer />
                            <CustomDragLayer />
                        </DndProvider>
                    )
                }
                <UploadPopover />
            </div>
        </Card>
    );
};

Storage.displayName = "Storage";

export default Storage;