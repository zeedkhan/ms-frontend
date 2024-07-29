"use client";

import { useRef, useState } from "react"
import { Package, Paperclip } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSocket } from "../providers/socket-provider";
import { useSession } from "next-auth/react";
import RoomStore from "@/state/room";
import { v4 as uuidv4 } from 'uuid';
import { uploadFile } from "@/db/upload";

const UploadFileMessageModal = () => {
    const currentChat = RoomStore((state) => state.currentChat);
    const fileRef = useRef<HTMLInputElement | null>(null);
    const { socket } = useSocket();
    const session = useSession();

    const [file, setFile] = useState<File | null>(null);

    const [open, setOpen] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && !file.type.startsWith("image/")) {
            setFile(file);
            setOpen(true);
        } else {
            toast.error("Invalid file type");
        }
    }

    const handleSend = async () => {
        if (session.status === "unauthenticated" || !currentChat?.id || !socket.id || !file) {
            toast.error("No connection");
            return;
        }

        try {
            const res = await uploadFile(file, `chat/${currentChat.id}`);
            if (res.storePath) {
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
            toast.error("Failed to send file");
        } finally {
            setOpen(false);
        }
    }

    if (session.status === "unauthenticated" || !currentChat?.id || !socket.id) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <input type="file" hidden id='upload-file' ref={fileRef} onChange={handleFileChange} />
                <Paperclip onClick={() => fileRef.current?.click()} className='cursor-pointer' size={20} />
            </DialogTrigger>
            {file && (
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            <p className="font-semibold">Ensure the file before sending.</p>
                        </DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col items-center jusitfy-center space-y-2">
                        <Package size={50} />
                        <p>Size: <b>{(file.size / (1024 * 1024)).toFixed(2)} mb.</b></p>
                        <p>Type: <b>{file.type}</b></p>
                    </div>
                    <DialogFooter>
                        <Button
                            onClick={handleSend}
                        >
                            Send
                        </Button>
                    </DialogFooter>
                </DialogContent>
            )}
        </Dialog>
    );
}

export default UploadFileMessageModal