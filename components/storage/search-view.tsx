"use client";

import UploadPopover from "./upload-popover";
import { useEffect } from "react";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DroppableDirectoryContainer } from "./droppable-directory";
import { DraggableFilesContainer } from "./draggable-items";
import CustomDragLayer from "./custom-drag-layer";
import { moveDirectory, moveStorageFilesToDirectory } from "@/db/storage";
import { toast } from "sonner";
import StorageStore from "@/state/storage";
import { search } from "@/db/directory";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { EnhanceButton } from "../ui/enhance-button";
import { Undo2 } from "lucide-react";
import ListView from "./list-view";

type Item = "file" | "directory";

const SearchView: React.FC = () => {
    const session = useSession();
    const { setDirectories, setFiles, setName, setParentId, setSelectIds } = StorageStore();
    const directories = StorageStore((state) => state.directories);
    const parentId = StorageStore((state) => state.parentId);
    const files = StorageStore((state) => state.files);
    const searchParams = useSearchParams();

    useEffect(() => {
        const getData = async () => {
            if (!session.data?.user) return;
            const { directories, files } = await search(searchParams.toString());
            setName("");
            setParentId(null);
            setDirectories(directories);
            setFiles(files);
        }
        getData();
    }, [searchParams]);


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
        <div className="md:min-h-[calc(100vh-200px)] max-h-[calc(100vh-112px)]">
            {parentId && (
                <div className="m-4">
                    <Link
                        className="w-full h-full"
                        href={`${parentId ? `/storage/${parentId}` : "/storage"}`}
                    >
                        <EnhanceButton
                            className="px-4 "
                            size={"sm"}
                            variant={"outlineExpandIcon"}
                            iconPlacement="left"
                            Icon={Undo2}
                        >
                            <p className="px-2">Back</p>
                        </EnhanceButton>
                    </Link>
                </div>
            )}

            {
                searchParams.get("view") === "list" ? <ListView /> : (
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
    );
};

SearchView.displayName = "SearchView";

export default SearchView;