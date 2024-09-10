"use client";

import ChatContent from "@/components/chat/ai/chat-content";
import { getAIChatRoom } from "@/db/chat";
import { Room } from "@/types";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function AiChatId() {
    const [room, setRoom] = useState<Room | null>(null);
    const pathname = usePathname();
    const id = pathname.split("/").pop();

    useEffect(() => {
        (async () => {
            const room = await getAIChatRoom(id as string);
            setRoom(room);
        })();
    }, []);

    if (!room) {
        return <div>Loading...</div>
    }

    return (
        <ChatContent room={room} />
    )
}