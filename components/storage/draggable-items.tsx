import { useDrag } from 'react-dnd';
import Directory from './directory';
import { Directory as DirectoryType, StorageFile } from '@/types';
import { cn } from '@/lib/utils';
import { Card } from '../ui/card';
import { File } from "../chat/message-file";
import { useEffect, useState } from 'react';
import { getEmptyImage } from 'react-dnd-html5-backend';
import StorageStore from '@/state/storage';
import { Separator } from '../ui/separator';
import { useRouter } from '../loader/use-router';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { EllipsisVertical, ExternalLink, FolderPlus, Info, PlusCircleIcon, Trash } from 'lucide-react';
import RemoveStorageFile from './remove-storage-file';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuShortcut, ContextMenuTrigger } from '../ui/context-menu';
import CreateDirectory from './create-directory';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';


type DraggableFileProps = {
    file: StorageFile;
}

const itemNameClass = "px-4 py-1 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer flex items-center justify-start space-x-4 transition"

const DraggableFile: React.FC<DraggableFileProps> = ({ file }) => {
    const selectedIds = StorageStore((state) => state.selectIds.ids);
    const isSelected = selectedIds.includes(file.id);
    const onClick = StorageStore((state) => state.handleSelectIds);
    const toggleShowInfo = StorageStore((state) => state.setOpenFileInfo);
    const router = useRouter();
    const [open, setOpen] = useState(false);

    const [_, dragRef, dragPreview] = useDrag({
        type: 'FILE',
        item: { ids: selectedIds, type: 'file' },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        canDrag() {
            return selectedIds.length > 0 && selectedIds.includes(file.id);
        },
    });

    useEffect(() => {
        dragPreview(getEmptyImage(), { captureDraggingState: true });
    }, [selectedIds, dragPreview]);

    return (
        <Card
            onContextMenu={(e) => {
                e.preventDefault();
                setOpen(true);
            }}
            onDoubleClick={() => router.push(`/file/${file.id}`)}
            ref={dragRef}
            onClick={() => onClick('file', file.id)}
            className={cn(
                `w-full mx-auto sm:mx-0 rounded-lg shadow-md cursor-pointer overflow-hidden`,
                `transition scale-100 duration-100 hover:scale-105`,
                `${isSelected ? "bg-sky-200 dark:bg-gray-600" : ""}`,

            )}>
            <div className='h-32 overflow-hidden'>
                <div className="pointer-events-none w-full h-full">
                    <File file={file} />
                </div>
            </div>
            <div>
                <Separator />
                <h4 className="p-0.5 text-center font-bold my-1 truncate text-sm">{file.name}</h4>
            </div>

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild
                    onClick={(e) => e.stopPropagation()}
                    className='absolute top-0 right-0 m-2'>
                    <EllipsisVertical size={18} />
                </PopoverTrigger>
                <PopoverContent className="rounded-md text-sm p-0 py-1">
                    <div
                        className={cn(`flex flex-col space-y-2 w-full`,)}
                    >
                        <div
                            onClick={() => router.push(`/storage/file/${file.id}`)}
                            className={cn(itemNameClass)}
                        >
                            <div className="w-5">
                                <ExternalLink size={18} />
                            </div>
                            <p>Open</p>
                        </div>

                        <div
                            onClick={toggleShowInfo}
                            className={cn(itemNameClass)}
                        >
                            <div className="w-5">
                                <Info size={18} />
                            </div>
                            <p>Folder information</p>
                        </div>

                        <RemoveStorageFile
                            storageFileId={file.id}
                        >
                            <div
                                className={cn(itemNameClass)}
                            >
                                <div className="w-5">
                                    <Trash size={18} />
                                </div>
                                <p>Remove</p>
                            </div>
                        </RemoveStorageFile>

                    </div>
                </PopoverContent>
            </Popover>

        </Card>
    );
};




export const DraggableFilesContainer = () => {
    const files = StorageStore((state) => state.files);
    return (

        <ContextMenu modal={false}>

            <ContextMenuTrigger>
                <div className="flex items-start justify-evenly">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 w-full p-8">
                        {files.map((file) => (
                            <DraggableFile
                                key={file.id}
                                file={file}
                            />
                        ))}
                    </div>
                </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
                <CreateDirectory>
                    <ContextMenuItem
                        onSelect={(e) => e.preventDefault()}
                        >
                        New folder
                        <ContextMenuShortcut>
                            <PlusCircleIcon size={18} />
                        </ContextMenuShortcut>
                    </ContextMenuItem>
                </CreateDirectory>
            </ContextMenuContent>

        </ContextMenu>

    );
}

type DraggableDirectoryProps = {
    directory: DirectoryType;
    isOver: boolean;
}

export const DraggableDirectory: React.FC<DraggableDirectoryProps> = ({
    directory,
    isOver,
}) => {
    return (
        <Directory
            isOver={isOver}
            directory={directory}
        />
    );
};
