"use client";

import { getUserAIChats, getUserChats } from "@/db/chat";
import RoomStore from "@/state/room";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import ListChatRooms from "./list-chat/list-chat-rooms";
import CreateRoomModal from "./create-room";
import Link from "next/link";
import { EnhanceButton } from "../ui/enhance-button";
import { ArrowLeft, ArrowRightIcon, PlusCircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Card, CardContent, CardTitle } from "../ui/card";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Input } from "../ui/input";

const ListChat = () => {
    const setRooms = RoomStore((state) => state.setRooms);
    const { chatRooms, aiChatRooms } = RoomStore((state) => state);
    const session = useSession();
    const pathname = usePathname();
    const cardRef = useRef<HTMLDivElement>(null);

    const [open, setOpen] = useState(true);

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

    return (
        <Card
            ref={cardRef}
            className={cn(
                `${pathname === "/chat" ? "flex w-full max-w-[380px] mx-auto" : "hidden w-1/4 max-w-[380px]"}`,
                `${!open && "w-16" }`,
                `md:flex flex-col space-y-4 shadow-none rounded-xl h-full`,
            )}
        >

            <ResizablePanelGroup
                direction="vertical"
                className="w-full h-full rounded-lg border "
            >
                <Card onClick={() => setOpen(!open)} role="button" className="w-8 m-2 z-50 cursor-pointer rounded-full ">
                    <CardContent className="p-0">
                        <div className="p-1">
                            <ArrowLeft size={22} className={`${!open && 'rotate-180'} transition duration-200`} />
                        </div>
                    </CardContent>
                </Card>

                <ResizablePanel defaultSize={25} >
                    <CardContent
                        style={{ height: `100%` }}
                        className="p-0 w-full">
                        <ListChatRooms
                            type="ai"
                            open={open}
                            createRoom={
                                <Card className="mx-2 rounded-full">
                                    <CardContent className="p-0 flex items-center justify-center space-x-2">
                                        <Link
                                            href="/chat/ai"
                                        >
                                            <EnhanceButton
                                                className={cn(
                                                    "p-2 rounded-full shadow-none",
                                                )}
                                            >
                                                <PlusCircleIcon />
                                            </EnhanceButton>
                                        </Link>


                                        <Input
                                            className="flex-grow rounded-full border-none "
                                            placeholder="Looking for something..."
                                        />



                                    </CardContent>
                                </Card>


                            }
                            rooms={aiChatRooms}
                        />
                    </CardContent>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={75} >
                    <CardContent className="p-0 w-full h-full">
                        <ListChatRooms
                            open={open}
                            type="chat"
                            createRoom={(
                                <Card className="mx-2 rounded-full">
                                    <CardContent className="p-0 flex items-center  justify-center space-x-2">
                                        <CreateRoomModal />
                                        <Input
                                            className="flex-grow rounded-full border-none "
                                            placeholder="Looking for something..."
                                        />
                                    </CardContent>
                                </Card>
                            )}
                            rooms={chatRooms}
                        />
                    </CardContent>
                </ResizablePanel>
            </ResizablePanelGroup>

        </Card >
    )
};


export default ListChat;