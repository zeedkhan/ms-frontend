import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Info } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import { toast } from "sonner";
import axios from "axios";
import { updateChatAvatar } from "@/db/chat";
import EditAvatar from "../edit-avatar";
import { getFile } from "@/lib/utils";
import { Room } from "@/types";

const EditRoomModal = ({
    room
}: { room: Room }) => {
    const [roomName, setRoomName] = useState(room?.name || '');

    // const handleChangeNames = async () => {
    //     if (!roomName) return;
    //     try {
    //         await axios.put(`/api/v1/room/${room?.id}`, {
    //             name: roomName,
    //         });
    //         // const res = req.data;
    //         toast.success("Room name updated successfully");
    //     } catch (error) {
    //         toast.error("Failed to update room name");
    //         console.log(error)
    //     }
    // }

    useEffect(() => {
        setRoomName(room?.name || '')
    }, []);

    return (
        <Dialog>
            <DialogTrigger>
                <Info
                    className=' hover:cursor-pointer'
                />
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit chat room</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                    </DialogDescription>


                    <div className="flex flex-col space-y-4 pt-4">

                        <EditAvatar
                            url={getFile(room.avatar, "https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/batman_hero_avatar_comics-512.png")}
                            objectId={room.id}
                            object="chat"
                            callback={updateChatAvatar}
                        />

                    </div>

                    <div className="pt-4">
                        <Card>
                            <CardHeader>
                                <h2 className="font-bold">Change chat room</h2>
                            </CardHeader>
                            <CardContent className="flex flex-col space-y-2">
                                <Input
                                    value={roomName}
                                    onChange={(e) => setRoomName(e.target.value)}
                                    id="room-name"
                                    placeholder={room.name}
                                />
                            </CardContent>

                            <CardFooter>
                                <Button
                                    // onClick={handleChangeNames}
                                    disabled={roomName === room.name || !roomName}
                                >
                                    <span>Save</span>
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}

export default EditRoomModal;