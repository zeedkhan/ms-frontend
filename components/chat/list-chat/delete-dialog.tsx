"use client";

import { useRouter } from "@/components/loader/use-router";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EnhanceButton } from "@/components/ui/enhance-button";
import { deleteAIChatRoom, deleteChatRoom } from "@/db/chat";
import RoomStore from "@/state/room";
import { usePathname } from "next/navigation";

type DeleteDialogProps = {
    id: string;
    isDeleteDialogOpen: boolean;
    setIsDeleteDialogOpen: (value: boolean) => void;
    type: "chat" | "ai";
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({
    id,
    type,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
}) => {
    const pathname = usePathname();
    const router = useRouter();
    const setRooms = RoomStore((state) => state.setRooms);
    const rooms = RoomStore((state) => type === "chat" ? state.chatRooms : state.aiChatRooms);

    const deleteRoom = async () => {
        try {
            if (type === "chat") {
                await deleteChatRoom(id);
            } else {
                await deleteAIChatRoom(id);
            }
            const newRooms = rooms.filter((room) => room.id !== id);
            setRooms(type, newRooms);
            if (pathname.split("/").pop() === id) {
                router.push("/chat");
            }
            setIsDeleteDialogOpen(false);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Dialog
            open={isDeleteDialogOpen}
            onOpenChange={() => setIsDeleteDialogOpen(!isDeleteDialogOpen)}
        >
            <DialogTrigger asChild></DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you sure to delete the chat</DialogTitle>
                </DialogHeader>

                <DialogDescription>
                    This action cannot be undone
                </DialogDescription>

                <p>chat: {id}</p>

                <DialogFooter className='mr-auto'>
                    <EnhanceButton
                        onClick={deleteRoom}
                        variant={"destructive"}
                    >
                        Delete
                    </EnhanceButton>

                    <DialogClose>Cancel</DialogClose>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    )
};


export default DeleteDialog;