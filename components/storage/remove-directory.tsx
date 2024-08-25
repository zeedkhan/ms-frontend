"use client";

import { ReactNode } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { EnhanceButton } from "../ui/enhance-button";
import { toast } from "sonner";
import StorageStore from "@/state/storage";
import { deleteDirectory } from "@/db/directory";

type RemoveDirectoryProps = {
    directoryId: string;
    children: ReactNode;
};

const RemoveDirectory: React.FC<RemoveDirectoryProps> = ({
    directoryId,
    children
}) => {
    const directories = StorageStore((state) => state.permanentDirectories);
    const setDirectories = StorageStore((state) => state.setDirectories);

    const removeDirectory = async () => {
        try {
            const remove = await deleteDirectory(directoryId);
            if (remove) {
                const filterDiretories = directories.filter((di) => di.id !== directoryId);
                setDirectories(filterDiretories);
                toast.success("File removed successfully");
            } else {
                toast.error("Failed! Please try again");
            }
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
                    <DialogTitle>Are you sure to remove directory?</DialogTitle>
                </DialogHeader>
                <DialogFooter>
                    <EnhanceButton
                        onClick={removeDirectory}
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



export default RemoveDirectory;