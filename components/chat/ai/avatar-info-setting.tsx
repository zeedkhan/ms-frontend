"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { EnhanceButton } from "@/components/ui/enhance-button";
import { ImageCropper } from "@/components/ui/image-cropper";
import { updateAIChatRoom } from "@/db/chat";
import { uploadImage } from "@/db/upload";
import { getFile } from "@/lib/utils";
import RoomStore from "@/state/room";
import { HardDriveUpload, UploadIcon } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useStore } from "zustand";


type FileWithPreview = File & {
    preview: string;
}

type AvatarInfoSettingProps = {
    avatar?: string;
    id: string;
}

const AvatarInfoSetting: React.FC<AvatarInfoSettingProps> = ({
    avatar,
    id
}) => {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<FileWithPreview | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const updateRoom = useStore(RoomStore, (state) => state.updateRoom);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const fileWithPreview = Object.assign(file, {
                preview: URL.createObjectURL(file),
            });
            setSelectedFile(fileWithPreview);
            setDialogOpen(true);
        }
    };

    const uploadAvatar = async () => {
        if (!selectedFile) return;
        try {
            const res = await uploadImage(selectedFile, `chat/${id}`);
            if (res.storePath) {
                await updateAIChatRoom(id, { avatar: res.storePath });
                updateRoom(id, { avatar: res.storePath })
            };
            toast.success("Avatar uploaded successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to upload avatar");
        }
    }

    return (
        <div className="py-8 flex items-center justify-center">
            {selectedFile ? (
                <div className="flex flex-col space-y-8 justify-center items-center">
                    <ImageCropper
                        dialogOpen={isDialogOpen}
                        setDialogOpen={setDialogOpen}
                        selectedFile={selectedFile}
                        setSelectedFile={setSelectedFile}
                    />
                    <div className="flex flex-col space-y-2 text-center">
                        <div className="text-gray-600 flex flex-col">
                            <small>Is the new image looks good?</small>
                            <small>Dont forget to upload it!</small>
                        </div>
                        <Button
                            onClick={uploadAvatar}
                            variant={"outline"}
                            className="flex items-center justify-evenly"
                        >
                            <p className="px-2">Upload avatar</p>
                            <UploadIcon size={18} />
                        </Button>
                    </div>

                </div>
            ) : (
                <Avatar
                    onClick={() => inputRef.current?.click()}
                    className="size-36 cursor-pointer ring-offset-2 ring-2 ring-slate-200"
                >
                    <input type="file" hidden accept="image/*" multiple ref={inputRef} onChange={handleChange} />
                    <AvatarImage src={getFile(avatar, "https://github.com/shadcn.png")} alt={avatar ? "Chat AI avatar" : "@shadcn"} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            )}
        </div>
    )
};


export default AvatarInfoSetting;