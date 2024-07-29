"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import React, {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";
import { io } from "socket.io-client";
import { toast } from "sonner";

type SocketContextType = {
    socket: any | null;
    isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false
});

export const useSocket = () => {
    return useContext(SocketContext);
};

export function SocketProvider({
    children
}: {
    children: React.ReactNode;
}) {
    const [socket, setSocket] = useState<any>(null);
    const [isConnected, setIsConnected] = useState(false);

    const session = useSession();

    useEffect(() => {
        const socketInstance = new (io as any)(
            process.env.NEXT_PUBLIC_SOCKET_URL as string,
        );

        setSocket(socketInstance);

        return () => {
            socketInstance.close();
        };
    }, []);

    const handleError = (data: any) => {
        toast.error(<>{JSON.stringify(data)}</>);
    };


    useEffect(() => {
        if (socket && session.data?.user.id) {

            socket.on("connect", () => {
                console.log("connected", socket.id);
                setIsConnected(true);
            });
            socket.on("disconnect", () => {
                console.log("disconnected", socket.id);
                setIsConnected(false);
            });
            socket.emit("userNotification", {
                chatRoomId: session.data.user.id,
                socketWithUser: {
                    socket: socket.id,
                    userId: session.data.user.id,
                },
            });

            socket.on("sendNotification", (data: any) => {
                toast.info(
                    <Link href={`/chat/${data.chatRoomId}`}>
                        sdasd
                    </Link>
                );
            });

            socket.on("error", handleError);


            return () => {
                socket.off("sendNotification");
                socket.off("connect");
                socket.off("disconnect");
                socket.off("error", handleError);
            }
        }
    }, [socket, session]);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
}