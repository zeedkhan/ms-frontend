"use client";

import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover"
import { EnhanceButton } from "../ui/enhance-button";
import { useRef } from "react"
import { CircleFadingPlus, FolderPlus } from "lucide-react";
import { toast } from "sonner";
import { uploadFile } from "@/db/upload";
import { uploadFileToStorage } from "@/db/storage";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import CreateDirectory from "./create-directory";

const UploadPopover = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const session = useSession();

    const upload = async (file: File, folder: string) => {
        try {
            const response = await uploadFile(file, folder);
            if (response.storePath) {
                const addStoratePath = await uploadFileToStorage({
                    key: response.storePath,
                    url: response.storePath,
                    userId: session.data?.user.id as string,
                    name: file?.name || "",
                    size: file?.size || 1,
                });
                if (addStoratePath.error) {
                    toast.error('Error uploading');
                    console.error('Error uploading:', addStoratePath.error);
                    return;
                }
                toast.success('Capture successfully uploaded.');
            } else {
                toast.error('Error uploading.');
                console.error('Error uploading:', response);
            }
        } catch (error) {
            toast.error('Error uploading');
            console.error('Error uploading:', error);
        }
    }

    const handleUpload = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };

    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            await upload(file, session.data?.user.id as string);
        }
    }

    return (
        <Popover>
            <PopoverTrigger asChild className="fixed md:bottom-20 md:right-20 bottom-10 right-10 z-50">
                <div className="shadow-xl rounded-full p-0.5 border-2 cursor-pointer border-black dark:border-white">
                    <input type="file" ref={inputRef} hidden onChange={onFileChange} />
                    <EnhanceButton
                        className="rounded-full"
                        variant="outlineExpandIcon"
                        Icon={CircleFadingPlus}
                        iconPlacement="right"
                    >
                        Upload
                    </EnhanceButton>
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-fit rounded-xl">
                <div className="flex flex-col space-y-4">
                    <div
                        onClick={handleUpload}
                        className={cn(
                            "cursor-pointer flex items-center justify-start space-x-4 transition",
                            "scale-100 duration-100 hover:scale-105"
                        )}>
                        <CircleFadingPlus size={24} />
                        <p>Local file</p>
                    </div>

                    <CreateDirectory>
                        <div
                            className={cn(
                                "cursor-pointer flex items-center justify-start space-x-4 transition",
                                "scale-100 duration-100 hover:scale-105"
                            )}
                        >
                            <FolderPlus />
                            <p>New folder</p>
                        </div>
                    </CreateDirectory>

                </div>
            </PopoverContent>
        </Popover>
    )
};


export default UploadPopover;