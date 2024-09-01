"use client";

import { PlugZap, Unplug } from "lucide-react";
import { useSocket } from "../providers/socket-provider";
import { Badge } from "../ui/badge";
import { useSession } from "next-auth/react";

const SocketIndecator = () => {
    const { isConnected } = useSocket();
    const session = useSession();
    
    if (!isConnected) {
        return (
            <Badge
                variant={"outline"}
                className="bg-yellow-600 text-white border-none flex space-x-2"
            >
                <Unplug size={18} />
                <p>
                    {session.data?.user ? "Fallback: Polling for connection" : "Not logged in"}
                </p>
            </Badge>
        );
    }

    return (
        <Badge
            variant={"outline"}
            className="bg-emerald-600 text-white border-none flex space-x-2"
        >
            <PlugZap size={18} />
            <p>
                Connected
            </p>
        </Badge>
    )
};


export default SocketIndecator;