"use client";

import { getUserAIChats, getUserChats } from "@/db/chat";
import RoomStore from "@/state/room";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import ListChatRooms from "./list-chat/list-chat-rooms";
import CreateRoomModal from "./create-room";
import Link from "next/link";
import { EnhanceButton } from "../ui/enhance-button";
import { ArrowRightIcon, PlusCircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Card, CardContent } from "../ui/card";

const ListChat = () => {
    const setRooms = RoomStore((state) => state.setRooms);
    const { chatRooms, aiChatRooms } = RoomStore((state) => state);
    const session = useSession();

    const pathname = usePathname();

    useEffect(() => {
        const getInfo = async () => {
            if (!session.data?.user.id) return;
            const userChats = await getUserChats(session.data.user.id);
            const aiRooms = await getUserAIChats(session.data.user.id);
            setRooms("chat", userChats)
            setRooms("ai", aiRooms)
        };
        getInfo();
    }, [session.data])

    if (!session.data || !session.data.user) {
        return null;
    };

    if (pathname === "/chat") {

    }

    return (
        <Card className={cn(
            `${pathname === "/chat" ? "flex w-full max-w-[380px] mx-auto" : "hidden w-1/4 max-w-[380px]"}`,
            `md:flex flex-col space-y-4 border shadow-xl rounded-xl h-full`,
        )}>
            <CardContent className="p-0 w-full h-full flex flex-col space-y-2">
                <ListChatRooms
                    type="chat"
                    createRoom={<CreateRoomModal />}
                    rooms={chatRooms}
                />

                <ListChatRooms
                    type="ai"
                    createRoom={
                        <Link
                            href="/chat/ai"
                        >
                            <EnhanceButton
                                variant="expandIcon"
                                Icon={ArrowRightIcon}
                                iconPlacement="right"
                                className={cn(
                                    "w-full h-full rounded-full md:rounded-md",
                                )}
                            >
                                <div className="flex space-x-2 items-center">
                                    <PlusCircleIcon />
                                    <p>Create a room</p>
                                </div>
                            </EnhanceButton>
                        </Link>

                    }
                    rooms={aiChatRooms}
                />
            </CardContent>
        </Card>
    )
};


export default ListChat;