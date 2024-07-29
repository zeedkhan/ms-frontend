"use client";

import { cn, getFile } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '../ui/scroll-area';
import { motion } from "framer-motion";
import { useSession } from 'next-auth/react';
import CreateRoomModal from './create-room';
import RoomStore from '@/state/room';
import { Room } from '@/types';
import { useRouter } from 'next/navigation';
import UseWindowSize from '@/hooks/use-window-size';
import { useEffect } from 'react';
import { getUserChats } from '@/db/chat';

interface DisplayRoomProps {
    extraClasses?: string;
}

const staggerVariants = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.05,
        },
    },
};

const itemVariants = {
    initial: { opacity: 0, y: 5 },
    animate: { opacity: 1, y: 0 },
};

const DisplayRooms: React.FC<DisplayRoomProps> = ({
    extraClasses,
}: { extraClasses?: string }) => {
    const session = useSession();
    const { setCurrentChat, currentChat } = RoomStore();
    const rooms = RoomStore((state) => state.rooms);
    const setRooms = RoomStore((state) => state.setRooms);
    const router = useRouter();
    const { isMobile } = UseWindowSize();

    useEffect(() => {
        const getInfo = async () => {
            if (!session.data?.user.id) return;
            const chats = await getUserChats(session.data.user.id);
            setRooms(chats)
        };
        getInfo();
    }, [session.data])

    if (!session.data || !session.data.user) {
        return null;
    };

    const onClick = (chat: Room) => {
        setCurrentChat(chat);
        router.push(`/chat/${chat.id}`);
    };

    if (isMobile) {
        return null
    }

    return (
        <ScrollArea
            className={cn(
                "w-1/4 max-w-[380px] p-2",
                extraClasses && extraClasses
            )}
        >
            <motion.ul
                initial="initial"
                animate="animate"
                variants={staggerVariants}
                className="list-none"
            >
                <motion.li
                    className={cn(
                        "cursor-pointer shadow-xl",
                        "rounded-md",
                    )}>
                    <CreateRoomModal />
                </motion.li>

                {rooms.map((chat, idx) => (
                    <motion.li
                        onClick={() => onClick(chat)}
                        key={idx}
                        variants={itemVariants}
                        className={cn(
                            "cursor-pointer shadow-md ",
                            " pl-3 border rounded-md my-2",
                            currentChat && currentChat.id === chat.id && "bg-sky-200",
                        )}
                    >
                        <div className="py-0.5 flex items-center justify-between hover:scale-95 transition-transform duration-50 ease-in-out ">
                            <div className='flex items-center space-x-4'>
                                <Avatar className='w-[35px] h-[35px]'>
                                    <AvatarImage
                                        src={chat?.avatar ? getFile(chat.avatar, "") : ""}
                                        width={35}
                                        height={35}
                                        className="rounded-full"
                                    />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <h3 className='max-w-20 truncate font-semibold text-xs'>
                                    {chat.name || "No Name"}
                                </h3>
                            </div>
                        </div>
                    </motion.li>
                ))}

            </motion.ul>
        </ScrollArea>

    );
}

export default DisplayRooms;