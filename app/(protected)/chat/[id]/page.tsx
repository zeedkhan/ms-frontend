"use client";

import ChatContent from "@/components/chat/chat-content";
import { useSocket } from "@/components/providers/socket-provider";

function Page() {
    const socket = useSocket();

    if (!socket.isConnected || !socket.socket) {
        return null;
    }

    return (
        <ChatContent  />
    )
}


export default Page;