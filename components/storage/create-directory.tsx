"use client";

import { ReactNode, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { createDirectory } from "@/db/directory";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { EnhanceButton } from "../ui/enhance-button";
import { Input } from "../ui/input";
import StorageStore from "@/state/storage";

const CreateDirectory = ({ children }: { children: ReactNode }) => {
    const pathname = usePathname();
    const session = useSession();
    const [curName, setCurName] = useState("");
    const store = StorageStore();
    const [open, setOpen] = useState(false);

    const handleCreateFolder = async () => {
        const currentDirectory = pathname.split("/").pop();
        try {
            const directory = await createDirectory({
                name: curName,
                userId: session.data?.user.id as string,
                parentId: currentDirectory
            });
            console.log("directory", directory);

            store.createDirectory(directory)

            setOpen(false);
            toast.success('Folder created successfully.');
        } catch (error) {
            toast.error('Error creating folder');
            console.error('Error creating folder:', error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="w-full">
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create</DialogTitle>
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
                        disabled={!curName}
                        onClick={handleCreateFolder}
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


export default CreateDirectory;