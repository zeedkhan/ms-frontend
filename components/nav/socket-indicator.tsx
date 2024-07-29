"use client";

import { PlugZap, Unplug } from "lucide-react";
import { useSocket } from "../providers/socket-provider";
import { Badge } from "../ui/badge";

const SocketIndecator = () => {
    const { isConnected } = useSocket();
    if (!isConnected) {
        return (
            <Badge
                variant={"outline"}
                className="bg-yellow-600 text-white border-none flex space-x-2"
            >
                <Unplug size={18} />
                <p>
                    Fallback: Polling for connection
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