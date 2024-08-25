import { create } from 'zustand'
import { Directory, StorageFile } from '@/types';
import { audioFileExtensions, imageFileExtensions, videoFileExtensions } from '@/lib/extensions';

type Item = "file" | "directory";

interface StorageController {
    directories: Directory[];
    setDirectories: (directories: Directory[]) => void;
    setParent: (directory: Directory) => void;
    setParentId: (parentId: string | null) => void;
    createDirectory: (directory: Directory) => void;
    setFiles: (files: StorageFile[]) => void;
    filterFilesType: (name: string) => void;
    filterFilesModified: (modified: string) => void;
    filterDirectories: (name: string) => void;
    removeFilesType: () => void;
    setName: (name: string) => void;
    permanentFiles: StorageFile[];
    permanentDirectories: Directory[];
    name: string;
    parent: Directory | null;
    currentDirectory: Directory | null;
    parentId: string | null;
    files: StorageFile[];

    openFileInfo: boolean;
    setOpenFileInfo: () => void;
    selectIds: { type: Item, ids: string[] };
    handleSelectIds: (selectType: Item, id: string) => void;
    setSelectIds: (selectIds: { type: Item, ids: string[] }) => void;
};

const StorageStore = create<StorageController>((set, get) => ({
    directories: [],
    parent: null,
    currentDirectory: null,
    parentId: null,
    files: [],
    permanentFiles: [],
    permanentDirectories: [],
    name: "",
    openFileInfo: false,
    selectIds: { type: "file", ids: [] },
    setSelectIds: (selectIds) => {
        set((prev) => ({ ...prev, selectIds: selectIds }))
    },
    /* 
        Handle select item states
    */
    handleSelectIds: (selectType: Item, id: string) => {
        const { type, ids } = get().selectIds;
        if (selectType !== type) {
            set((prev) => ({ ...prev, selectIds: { type: selectType, ids: [id] } }));
            return;
        };
        if (ids.includes(id)) {
            set((prev) => ({ ...prev, selectIds: { type, ids: ids.filter((i) => i !== id) } }));
            return;
        }
        set((prev) => ({ ...prev, selectIds: { type, ids: [...ids, id] } }));
    },
    setOpenFileInfo: () => {
        set((prev) => ({ ...prev, openFileInfo: !get().openFileInfo }))
    },
    filterDirectories: (name) => {
        set((prev) => ({ ...prev, directories: prev.directories.filter((directory) => directory.name.includes(name)) }))
    },
    filterFilesModified: (modified) => {
        set((prev) => ({ ...prev, files: prev.files.filter((file) => file.updatedAt.includes(modified)) }))
    },
    removeFilesType: () => {
        set((prev) => ({ ...prev, files: prev.permanentFiles }))
    },
    filterFilesType: (type) => {
        const filterByExtension = (file: StorageFile, extensions: string[]) =>
            extensions.some(ext => file.name.toLowerCase().endsWith(ext) || file.url.toLowerCase().endsWith(ext));
        set((prev) => {
            let filteredFiles: StorageFile[] = [];
            if (type === "audio") {
                filteredFiles = prev.permanentFiles.filter((file) => filterByExtension(file, audioFileExtensions));
            } else if (type === "video") {
                filteredFiles = prev.permanentFiles.filter((file) => filterByExtension(file, videoFileExtensions));
            } else if (type === "image") {
                filteredFiles = prev.permanentFiles.filter((file) => filterByExtension(file, imageFileExtensions));
            } else {
                filteredFiles = prev.permanentFiles.filter((file) => file.name.toLowerCase().includes(type.toLowerCase()) || file.url.toLowerCase().includes(type.toLowerCase()));
            }
            return { ...prev, files: filteredFiles };
        });
    },
    setName: (name) => {
        set((prev) => ({ ...prev, name: name }))
    },
    setParentId: (parentId) => {
        set((prev) => ({ ...prev, parentId: parentId }))
    },
    setParent: (directory) => {
        set((prev) => ({ ...prev, parent: directory }))
    },
    setDirectories: (directories) => {
        set((prev) => ({ ...prev, directories: directories, permanentDirectories: directories }))
    },
    setFiles: (files) => {
        set((prev) => ({ ...prev, files: files, permanentFiles: files }))
    },
    createDirectory: (directory) => {
        set((prev) => {
            const newDirectories = [directory, ...prev.directories];
            return { ...prev, directories: newDirectories };
        });
    }
}));

export default StorageStore;