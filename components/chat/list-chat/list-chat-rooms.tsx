"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, getFile } from "@/lib/utils";
import { Room } from "@/types";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EllipsisVertical, Trash } from 'lucide-react';
import { EnhanceButton } from "@/components/ui/enhance-button";
import DeleteDialog from "./delete-dialog";


interface DisplayRoomProps {
    extraClasses?: string;
    createRoom: ReactNode;
    rooms: Room[]
    type: "chat" | "ai";
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

const ListChatRooms: React.FC<DisplayRoomProps> = ({
    extraClasses,
    createRoom,
    type,
    rooms
}) => {
    const pathname = usePathname();
    const [currentChatId, setCurrentChatId] = useState<string | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectChatId, setSelectChatId] = useState<string | null>(null);

    useEffect(() => {
        const currentPath = pathname.split("/").pop();
        const roomIds = rooms.map((room) => room.id);
        if (currentPath && roomIds.includes(currentPath)) {
            setCurrentChatId(currentPath);
        } else {
            setCurrentChatId(null);
        }
    }, [pathname, rooms]);

    const chatRoute = type === "chat" ? "/chat" : "/chat/ai";

    return (
        <ScrollArea
            className={cn(
                "w-full h-full p-2",
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
                        "rounded-md sticky top-0 z-20",
                    )}>
                    {createRoom}
                </motion.li>

                {rooms.map((chat, idx) => (
                    <motion.li
                        key={idx}
                        variants={itemVariants}
                        className={cn(
                            "cursor-pointer shadow-md flex justify-between items-center",
                            "pl-3 border rounded-md my-2",
                            currentChatId === chat.id && "shadow bg-teal-200",
                        )}
                    >
                        <Link
                            href={chatRoute + "/" + chat.id}
                            className="flex-1 py-0.5 flex items-center justify-between hover:scale-95 transition-transform duration-50 ease-in-out">
                            <div className='flex items-center space-x-2'>
                                <Avatar className='w-[35px] h-[35px]'>
                                    <AvatarImage
                                        src={chat?.avatar ? getFile(chat.avatar, "") : ""}
                                        width={35}
                                        height={35}
                                        className="rounded-full"
                                    />
                                    <AvatarFallback >CN</AvatarFallback>
                                </Avatar>
                                <h3 className='max-w-20 truncate font-semibold text-xs '>
                                    {chat.name || "No Name"}
                                </h3>
                            </div>
                        </Link>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <EnhanceButton
                                    className='border-none rounded-full h-fit p-1 mx-2'
                                    variant={"secondary"}
                                >
                                    <EllipsisVertical size={18} />
                                </EnhanceButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    className='cursor-pointer flex items-center justify-between w-full'
                                    onClick={() => {
                                        setSelectChatId(chat.id)
                                        setIsDeleteDialogOpen(true)
                                    }}
                                >
                                    <span>Delete</span>
                                    <Trash size={16} />
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {selectChatId && (
                            <DeleteDialog
                                type={type}
                                id={selectChatId}
                                isDeleteDialogOpen={isDeleteDialogOpen}
                                setIsDeleteDialogOpen={setIsDeleteDialogOpen}
                            />
                        )}

                    </motion.li>
                ))}

            </motion.ul>
        </ScrollArea>
    )
}

export default ListChatRooms;