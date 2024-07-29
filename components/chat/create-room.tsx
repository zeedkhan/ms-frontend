"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { EnhanceButton } from "@/components/ui/enhance-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import UseWindowSize from "@/hooks/use-window-size"
import { cn } from "@/lib/utils"
import RoomStore from "@/state/room"
import { ArrowRightIcon, PlusCircleIcon } from "lucide-react"
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react"
import { MultiSelector, MultiSelectorContent, MultiSelectorInput, MultiSelectorItem, MultiSelectorList, MultiSelectorTrigger } from "@/components/ui/multiple-select";
import { getAllUsers } from "@/db/user";
import { User } from "@/types";


type Option = { label: string; value: string }

const usersToOptions = (users: User[]): Option[] => {
    return users.map(user => ({
        label: user.name || user.email || "Unknown",
        value: user.id
    }))
}


function CreateRoomModal() {
    const [roomName, setRoomName] = useState("");
    const [open, setOpen] = useState(false);
    const { createRoom } = RoomStore();
    const { isMobile } = UseWindowSize();
    const session = useSession();
    const [options, setOptions] = useState<Option[]>([])

    const [users, setUsers] = useState<string[]>([]);

    // load users from the server
    useEffect(() => {
        const loadUsers = async () => {
            const allUsers = await getAllUsers();
            setOptions(usersToOptions(allUsers) || [])
        }
        loadUsers();
    }, [])

    const handleCreateRoom = async () => {
        if (!session.data || !session.data.user || !roomName) {
            return;
        }
        const uniqueUsers = [...Array.from(new Set(users))];
        try {
            await createRoom(uniqueUsers, roomName);
        } catch (error) {
            console.log(error);
        } finally {
            setOpen(false);
            setRoomName("");
        }
    }

    if (!session.data || !session.data.user) {
        return null;
    }

    return (
        <Dialog onOpenChange={setOpen} open={open}>
            <DialogTrigger asChild>
                <EnhanceButton
                    variant="expandIcon"
                    Icon={ArrowRightIcon}
                    iconPlacement="right"
                    className={cn(
                        "w-full h-full",
                        isMobile ? "rounded-full" : "rounded-md",
                    )}
                >
                    <div className="flex space-x-2 items-center">
                        <PlusCircleIcon />
                        {!isMobile && <p>Create a room</p>}
                    </div>
                </EnhanceButton>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create a new chat room</DialogTitle>
                    <DialogDescription>
                        Name your chat room and start chatting with your friends
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="chat-name" className="text-right">
                            Chat Name
                        </Label>
                        <Input
                            onChange={(e) => setRoomName(e.target.value)}
                            value={roomName}
                            id="chat-name"
                            placeholder="Let's chat"
                            defaultValue="Let's chat"
                            className="col-span-3"
                        />
                    </div>
                </div>
                <div>
                    <MultiSelector
                        values={users}
                        onValuesChange={setUsers} loop={false}
                    >
                        <MultiSelectorTrigger className="p-2 rounded-xl ">
                            <MultiSelectorInput placeholder="Select your framework" value="Select your framework" />
                        </MultiSelectorTrigger>

                        <MultiSelectorContent>
                            <MultiSelectorList>
                                {options.map((option, i) => (
                                    <MultiSelectorItem key={i} value={option.value} >
                                        {option.label}
                                    </MultiSelectorItem>
                                ))}
                            </MultiSelectorList>
                        </MultiSelectorContent>
                    </MultiSelector>
                </div>
                <DialogFooter>
                    <EnhanceButton
                        onClick={handleCreateRoom}
                        type="submit"
                    >
                        Save changes
                    </EnhanceButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CreateRoomModal;