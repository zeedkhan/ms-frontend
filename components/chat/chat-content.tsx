"use client";

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Circle, Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Input } from '@/components/ui/input';
import { EmojiPicker } from './emoji-picker';
import UploadFileMessageModal from './upload-file-modal';
import UploadImageMessageModal from './upload-img-modal';
import { ChatList } from './chat-list';
import { useSession } from 'next-auth/react';
import { Message, Room } from '@/types';
import { getChatRoom } from '@/db/chat';
import { usePathname } from 'next/navigation';
import TimeAgo from 'timeago-react';
import { useSocket } from '../providers/socket-provider';
import EditRoomModal from './edit-room-modal';
import { getFile } from '@/lib/utils';
import Gifs from './gifs';
import { Card, CardContent } from '../ui/card';


// if the room has more than two users, we will show the room name
// if the room has only two users, we will show the opposite user name
const headerName = (chat: Room | null, currentUserId: string) => {
    if (!chat) return "Select a chat to start";
    if (chat.users.length === 2) {
        const otherUser = chat.users.find((user) => user.id !== currentUserId);
        return otherUser?.user.name || "Unknown";
    }
    return chat.name;
}

const ChatContent = () => {
    const [text, setText] = useState("");
    const session = useSession();
    const pathname = usePathname();
    const chatId = pathname.split('/').pop();
    const [room, setRoom] = useState<Room | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);

    const joinRef = useRef(false);

    useEffect(() => {
        (async () => {
            const chat = await getChatRoom(chatId as string);
            setRoom(chat);
            setMessages(chat?.messages as Message[] || []);
        })();
    }, [])

    const { socket, isConnected } = useSocket();
    const [activeUsers, setActiveUsers] = useState<{
        id?: string;
        name?: string;
        avatar?: string;
        socket: string;
        userId: string;
    }[]>([]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!text || !room) return;
        if (!session.data?.user.id) return;
        setText("");
        socket.emit("message", {
            id: uuidv4(),
            chatRoomId: room?.id,
            text: text,
            type: "TEXT",
            userId: session.data?.user.id,
            createdAt: new Date().toISOString()
        });
    };

    useEffect(() => {
        if (!socket || !isConnected || !session.data?.user || !chatId || joinRef.current) return;
        socket.emit("joinRoom", {
            chatRoomId: chatId,
            socketWithUser: {
                socket: socket.id,
                userId: session.data.user.id,
            },
        });

        joinRef.current = true;

        const handleUserJoinRoom = (data: any) => {
            const newUsers = data.users.filter((i: any) => i.socket);
            const users = newUsers.filter((i: any) => i.socket !== socket.id);
            setActiveUsers(users);
        };

        const handleUserDisconnect = (data: any) => {
            if (!activeUsers) return;
            const newUsers = activeUsers.filter(
                (i) => i.socket && i.socket !== data.socketWithUser.socket
            );
            setActiveUsers(newUsers);
        };

        const handleMessageReceive = (data: any) => {
            if (data.chatRoomId !== chatId) return;
            setMessages((prev) => [...prev, data]);
        };


        socket.on("userJoinRoom", handleUserJoinRoom);
        socket.on("userDisconnect", handleUserDisconnect);
        socket.on("receiveMessage", handleMessageReceive);

        return () => {
            setActiveUsers([]);
            joinRef.current = false;
            socket.emit("leaveRoom", { room: chatId });
            socket.off("userJoinRoom", handleUserJoinRoom);
            socket.off("userDisconnect", handleUserDisconnect);
            socket.off("receiveMessage", handleMessageReceive);
        };
    }, [socket, chatId, session.data, isConnected]);

    if (!session.data) {
        return null
    }

    return (
        <div className="flex-1 flex px-16 mx-auto">
            <div className='flex-1 h-full relative'>
                {/* Header */}
                <Card className='h-[64px] absolute top-0 w-full shadow-sm'>
                    <CardContent>
                        <div className='h-full py-2 px-4'>
                            <div className='flex items-center justify-between'>
                                <div className='flex space-x-4 items-center'>

                                    <div className='relative'>
                                        {activeUsers.length > 0 && <Circle className='absolute shadow-md bottom-0 text-green-400 right-0 bg-green-400 w-4 h-4 rounded-full z-50' />}
                                        <Avatar className='w-[40px] h-[40px]'>
                                            <AvatarImage
                                                src={room?.avatar ? getFile(room.avatar, "") : ""}
                                                width={40}
                                                height={40}
                                                className=""
                                            />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>

                                    </div>

                                    <div className='flex flex-col '>
                                        <span>{headerName(room, session.data.user.id)}</span>
                                        {room && (
                                            <span>
                                                <TimeAgo datetime={room?.updatedAt} />
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {room && (
                                    <EditRoomModal
                                        room={room}
                                    />
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {room?.messages && room.users && (
                    <ChatList messages={messages || []} users={room?.users || []} userId={session.data.user.id} />
                )}

                {/* Input */}
                <form
                    onSubmit={handleSubmit}
                    className="flex w-full h-20 space-x-4 py-4 px-4 absolute bottom-0 left-0 border-t"
                >
                    {(!text && room) && (
                        <div className='m-auto flex flex-row space-x-3'>
                            <UploadFileMessageModal
                                room={room}
                            />
                            <UploadImageMessageModal
                                room={room}
                            />
                        </div>
                    )}

                    {!!text && (
                        <EmojiPicker
                            onChange={(value: any) => {
                                setText(text + value)
                            }}
                        />
                    )}

                    {room?.id && (
                        <Gifs
                            chatRoomId={room?.id}
                            userId={session.data.user.id}
                        />
                    )}

                    <Input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className='w-full rounded-xl dark:border-gray-200 border m-auto'
                        placeholder='Send a message'
                    />

                    {!!text && (
                        <div className='m-auto'>
                            <Send size={18} />
                        </div>
                    )}

                </form>
            </div>
        </div >
    );
}

export default ChatContent;