import { Directory as DirectoryType } from '@/types';
import { useDrop } from 'react-dnd';
import { DraggableDirectory } from './draggable-items';
import StorageStore from '@/state/storage';

type DroppableDirectoryProps = {
    directory: DirectoryType;
    onDrop: (item: any, directoryId: string) => void;
}

export const DroppableDirectory: React.FC<DroppableDirectoryProps> = ({
    directory,
    onDrop,
}) => {
    const [{ isOver }, dropRef] = useDrop({
        accept: ['FILE', 'DIRECTORY'],
        drop: (item) => {
            onDrop(item, directory.id);
        },
        collect: (monitor) => {
            return {
                isOver: monitor.isOver({ shallow: true }),
                canDrop: monitor.canDrop(),
            }
        }
    });

    return (
        <div
            ref={dropRef}
        >
            <DraggableDirectory
                directory={directory}
                isOver={isOver}
            />
        </div>
    );
};

/*
    DroppableDirectoryContainer will contains both DraggableDirectory and DroppableDirectory
    
    DirectoryContainer will contains both DraggableDirectory and DroppableDirectory
    A directory should be able to be dragged and dropped
*/
export const DroppableDirectoryContainer = ({
    handleDrop
}: {
    handleDrop: (item: any, directoryId: any) => void
}) => {
    const directories: DirectoryType[] = StorageStore((state) => state.directories);
    return (
        <div className="w-full p-6 pb-0 flex flex-wrap">
            {directories.map((directory) => (
                <div className='p-2' key={directory.id}>
                    <DroppableDirectory
                        directory={directory}
                        onDrop={handleDrop}
                    />
                </div>
            ))}
        </div>
    )
}