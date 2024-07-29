"use client";

import { useEffect, useRef, useState } from "react"
import { ImagePlus } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import RoomStore from "@/state/room";
import { useSocket } from "../providers/socket-provider";
import { useSession } from "next-auth/react";
import { uploadImage } from "@/db/upload";


const UploadImageMessageModal = () => {
    const currentChat = RoomStore((state) => state.currentChat);
    const { socket } = useSocket();
    const session = useSession();

    const fileRef = useRef<HTMLInputElement | null>(null);

    const [preview, setPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [open, setOpen] = useState(false);


    useEffect(() => {
        if (!file) {
            setPreview(null)
            return
        }

        const objectUrl = URL.createObjectURL(file)
        setPreview(objectUrl)

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [file]);

    const handleSend = async () => {
        if (session.status === "unauthenticated" || !currentChat?.id || !socket.id || !file) {
            toast.error("No connection");
            return;
        }

        try {
            const res = await uploadImage(file, `chat/${currentChat.id}`);
            if (res?.storePath) {
                socket.emit("message", {
                    chatRoomId: currentChat.id,
                    userId: session.data?.user.id,
                    type: "FILE",
                    text: "",
                    files: [{
                        name: file?.name || "",
                        size: file?.size || 0,
                        key: res.storePath,
                        url: res.storePath,

                    }],
                    createdAt: new Date().toISOString(),
                    id: uuidv4()
                });
                toast.success("Image sent")
            }
        } catch (error) {
            console.error(error)
            toast.error("Failed to send image")
        } finally {
            setOpen(false);
        }
    }


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile(file);
            const reader = new FileReader();
            reader.onload = () => {
                setPreview(reader.result as string);
            };
            setOpen(true);
        }
    }

    if (session.status === "unauthenticated" || !currentChat?.id || !socket.id) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <input type="file" hidden id='upload-image' accept="image/*" ref={fileRef} onChange={handleFileChange} />
                <ImagePlus onClick={() => fileRef.current?.click()} className='cursor-pointer' size={20} />
            </DialogTrigger>
            {preview && (
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            <p className="font-semibold">Ensure the file before sending.</p>
                        </DialogTitle>
                    </DialogHeader>
                    <img src={preview} alt="preview-img" />
                    <DialogFooter>
                        <Button
                            onClick={handleSend}
                        >
                            Send</Button>
                    </DialogFooter>
                </DialogContent>
            )}


        </Dialog>
    );
}

export default UploadImageMessageModal;