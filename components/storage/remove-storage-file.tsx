"use client";

import { ReactNode } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { EnhanceButton } from "../ui/enhance-button";
import { toast } from "sonner";
import { deleteStorageFile } from "@/db/storage";
import StorageStore from "@/state/storage";

type RemoveStorageFileProps = {
    storageFileId: string;
    children: ReactNode;
};

const RemoveStorageFile: React.FC<RemoveStorageFileProps> = ({
    storageFileId,
    children
}) => {
    const files = StorageStore((state) => state.permanentFiles);
    const setFiles = StorageStore((state) => state.setFiles);

    const removeStorageFile = async () => {
        try {
            await deleteStorageFile(storageFileId);
            const filterFiles = files.filter((file) => file.id !== storageFileId);
            setFiles(filterFiles);
            toast.success("File removed successfully");
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
                    <DialogTitle>Are you sure to remove file?</DialogTitle>
                </DialogHeader>
                <DialogFooter>
                    <EnhanceButton
                        onClick={removeStorageFile}
                        size={"sm"}
                        className="text-xs"
                        variant={"gooeyRight"}
                        type="submit"
                    >
                        Remove
                    </EnhanceButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};



export default RemoveStorageFile;