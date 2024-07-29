"use client";

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Circle, LockKeyhole, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Input } from '@/components/ui/input';
import { EmojiPicker } from './emoji-picker';
import UploadFileMessageModal from './upload-file-modal';
import UploadImageMessageModal from './upload-img-modal';
import { ChatList } from './chat-list';
import { useSession } from 'next-auth/react';
import RoomStore from '@/state/room';
import { Message, Room } from '@/types';
import { getChatRoom } from '@/db/chat';
import { usePathname } from 'next/navigation';
// import Gifs from '@/components/shared/gifs';
import TimeAgo from 'timeago-react';
import { useSocket } from '../providers/socket-provider';
import EditRoomModal from './edit-room-modal';
import { getFile } from '@/lib/utils';
import Gifs from './gifs';


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
    const currentChat = RoomStore((state) => state.currentChat);
    const [messages, setMessages] = useState<Message[]>(currentChat?.messages || []);
    const setCurrentChat = RoomStore((state) => state.setCurrentChat);
    const { socket, isConnected } = useSocket();
    const pathname = usePathname();
    const [isUserInTheChat, setIsUserInTheChat] = useState<boolean>(false);
    const [activeUsers, setActiveUsers] = useState<{
        id?: string;
        name?: string;
        avatar?: string;
        socket: string;
        userId: string;
    }[]>([]);

    useEffect(() => {
        const currentPath = pathname.split("/");
        const getMessages = async () => {
            if (currentPath.length <= 2) return;
            const lastPath = currentPath.pop();
            if (currentChat?.id === lastPath) return;
            if (!lastPath) return;
            const req = await getChatRoom(lastPath);
            if (!req) return;
            setCurrentChat(req);
        };
        getMessages();
    }, [pathname, setCurrentChat]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!text || !currentChat) return;
        if (!session.data?.user.id) return;

        setText("");

        socket.emit("message", {
            id: uuidv4(),
            chatRoomId: currentChat?.id,
            text: text,
            type: "TEXT",
            userId: session.data?.user.id,
            createdAt: new Date().toISOString()
        });
    };


    useEffect(() => {
        if (currentChat && isConnected && session.data) {
            const findUserInChat = currentChat.users.find((user) => user.userId === session.data?.user.id);
            if (findUserInChat) {
                setIsUserInTheChat(true);
            } else {
                setIsUserInTheChat(false);
            }
        }
    }, [currentChat, session.data, isConnected])


    useEffect(() => {
        setMessages(currentChat?.messages || []);
    }, [currentChat?.messages])


    useEffect(() => {
        if (isConnected && socket && currentChat && session.data?.user.id) {
            socket.emit("joinRoom", {
                chatRoomId: currentChat.id,
                socketWithUser: {
                    socket: socket.id,
                    userId: session.data.user.id,
                },
            });

            const handleUserJoinRoom = (data: any) => {
                setActiveUsers(data.users);
            };

            const handleUserDisconnect = (data: any) => {
                if (!activeUsers) return;
                const newUsers = activeUsers.filter(
                    (i) => i.socket !== data.socketWithUser.socket
                );
                setActiveUsers(newUsers);
            };

            const handleMessageReceive = (data: any) => {
                if (data.chatRoomId !== currentChat.id) return;
                setMessages((prev) => [...prev, data]);
            };

            socket.on("userJoinRoom", handleUserJoinRoom);
            socket.on("userDisconnect", handleUserDisconnect);
            socket.on("receiveMessage", handleMessageReceive);

            return () => {
                socket.emit("leaveRoom", { room: currentChat.id });
                socket.off("userJoinRoom", handleUserJoinRoom);
                socket.off("userDisconnect", handleUserDisconnect);
                socket.off("receiveMessage", handleMessageReceive);
            };
        }
    }, [socket, isConnected, session.data?.user.id]);


    if (isUserInTheChat === false && session.data?.user) {
        return (
            <div className="flex-1 border-l flex flex-col items-center justify-center space-y-4">
                <LockKeyhole size={128} />
                <p className='font-bold'>Permission denied!</p>
            </div>
        )
    }

    if (!session.data || !session.data.user) {
        return null
    }

    return (
        <div className="flex-1 border-l flex">
            <div className='flex-1 h-full relative'>
                {/* Header */}
                <div className="h-[64px] absolute top-0 w-full border-b shadow-sm">
                    <div className='h-full py-2 px-4'>
                        <div className='flex items-center justify-between'>
                            <div className='flex space-x-4 items-center'>

                                <div className='relative'>
                                    {activeUsers.length > 1 && <Circle className='absolute shadow-md bottom-0 text-green-400 right-0 bg-green-400 w-4 h-4 rounded-full z-50' />}
                                    <Avatar className='w-[40px] h-[40px]'>
                                        <AvatarImage
                                            src={currentChat?.avatar ? getFile(currentChat.avatar, "") : ""}
                                            width={40}
                                            height={40}
                                            className=""
                                        />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>

                                </div>

                                <div className='flex flex-col '>
                                    <span>{headerName(currentChat, session.data.user.id)}</span>
                                    {currentChat && (
                                        <span>
                                            <TimeAgo datetime={currentChat?.updatedAt} />
                                        </span>
                                    )}
                                </div>
                            </div>

                            <EditRoomModal />
                        </div>
                    </div>
                </div>

                {/* Content */}
                {!currentChat && (
                    <div>
                        <h2 className="pt-16 text-bold text-2xl">Select a chat to start</h2>
                    </div>
                )}

                {currentChat?.messages && currentChat.users && (
                    <ChatList messages={messages || []} users={currentChat?.users || []} userId={session.data.user.id} />
                )}

                {/* Input */}
                <form
                    onSubmit={handleSubmit}
                    className="flex w-full h-20 space-x-4 py-4 px-4 absolute bottom-0 left-0 border-t"
                >
                    {!text && (
                        <div className='m-auto flex flex-row space-x-3'>
                            <UploadFileMessageModal />
                            <UploadImageMessageModal />
                        </div>
                    )}

                    {!!text && (
                        <EmojiPicker
                            onChange={(value: any) => {
                                setText(text + value)
                            }}
                        />
                    )}

                    {currentChat?.id && (
                        <Gifs
                            chatRoomId={currentChat?.id}
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