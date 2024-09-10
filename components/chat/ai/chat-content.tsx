"use client";

import { UserNav } from "@/components/nav/user-nav";
import { Button } from "@/components/ui/button";
import { cn, getFile, waitForElm } from "@/lib/utils";
import { Message, ToolInvocation } from "ai";
import { useSession } from "next-auth/react";
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Session } from 'next-auth/types';
import { Room } from "@/types";
import Markdown from "@/components/editor/markdown";
import Tools from "./tools";
import { Separator } from "@/components/ui/separator";
import { ArrowDown } from "lucide-react";
import RoomSetting from "./room-setting";
import ChatInput from "./chat-input";
import { useChat } from "ai/react";
import { appendMessageAIRoom, createAIChatRoom } from "@/db/chat";
import { toast } from "sonner";
import ChatHeader from "./chat-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePathname, useSearchParams } from "next/navigation";
import RoomStore from "@/state/room";


type ChatContentProps = {
    room: Room | null
}

const ChatContent: React.FC<ChatContentProps> = ({
    room
}) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const session = useSession();
    const [showScrollBottom, setShowScrollToBottom] = useState<boolean>(!!room?.messages.length);
    const [files, setFiles] = useState<FileList | undefined>(undefined);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showSetting, setShowSetting] = useState<boolean>(false);

    const rooms = RoomStore((state) => state.aiChatRooms);
    const setRooms = RoomStore((state) => state.setRooms);

    const roomRef = useRef(room);

    const pathname = usePathname();
    const searchParams = useSearchParams();

    /*
        Control the setting view and UI based on the query params
    */
    useEffect(() => {
        if (searchParams.get("setting")) {
            setShowSetting(true);
            setShowScrollToBottom(false);
        } else {
            setShowSetting(false);
        }
    }, [searchParams, pathname])

    const {
        isLoading,
        messages,
        input,
        addToolResult,
        handleInputChange,
        handleSubmit
    } = useChat({
        maxToolRoundtrips: 5,
        api: '/api/ai/chat',
        body: {
            id: roomRef.current?.id,
        },
        async onFinish(message, options) {
            if (roomRef.current) {
                await appendMessageAIRoom(roomRef.current.id as string, message);
            }
        },
        async onToolCall({ toolCall }) {
            if (toolCall.toolName === 'getLocation') {
                return await new Promise((resolve) => {
                    navigator.geolocation.getCurrentPosition((position) => {
                        const location = JSON.stringify({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        });
                        resolve(location);
                        return location;
                    });
                });
            }
        }
    });

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!session.data?.user) {
            toast.error("You need to login to chat");
            return;
        };
        if (!roomRef.current) {
            await new Promise((resolve, reject) => {
                createAIChatRoom([session.data.user.id as string], "Untitled").then((room) => {
                    if (!room) {
                        toast.error("Failed to create room");
                        reject("Failed to create room");
                        return;
                    }
                    roomRef.current = room;
                    toast.success("Room created");
                    setRooms("ai", [room, ...rooms]);
                    handleSubmit(event, {
                        body: {
                            id: room.id,
                        },
                        experimental_attachments: files,
                    });
                    resolve(true);
                });
            })
            return;
        } else {
            handleSubmit(event, {
                experimental_attachments: files,
            });
        };

        setFiles(undefined);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        toast.success("Message sent");
    };

    const allMessages = useMemo(() => {
        return [...room?.messages as Message[] || [], ...messages];
    }, [messages, room]);


    useEffect(() => {
        if (!allMessages.length || showSetting) return;

        let observer: IntersectionObserver | null = null;
        waitForElm(`#msg-${allMessages.length - 1}`).then(() => {
            const lastMessageEl = document.querySelector(`#msg-${allMessages.length - 1}`) as Element;

            observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setShowScrollToBottom(false);
                    } else {
                        setShowScrollToBottom(true);
                    }
                });
            });

            // Observe after a short delay to ensure the DOM has settled
            setTimeout(() => {
                if (lastMessageEl) {
                    observer?.observe(lastMessageEl);
                }
            }, 100);
        });

        return () => {
            // Clean up observer when the component is unmounted or messages change
            observer?.disconnect();
        };
    }, [allMessages, showSetting]);


    const scrollToBottom = useCallback(() => {
        if (!allMessages.length) return;
        const n = allMessages.length - 1;
        waitForElm(`#msg-${n}`).then(() => {
            document.getElementById(`msg-${n}`)?.scrollIntoView(false);
        });
    }, [allMessages])

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFiles(event.target.files);
        }
    };

    const checkSameUser = (current: number, next: number) => {
        return (allMessages[next]?.role || "") === allMessages[current]?.role;
    }

    return (
        <div className="relative flex flex-col w-full flex-1 mx-auto md:mx-0 md:max-w-[calc(100%-25%)]">

            {roomRef.current && (
                <ChatHeader
                    room={roomRef.current}
                    showSetting={showSetting}
                />
            )}

            <ScrollArea
                ref={scrollRef}
                className={cn(
                    "h-full border-r border-none px-4 mx-auto w-full",
                )}
            >
                {!showSetting ? (
                    <div className="px-0 md:px-4 lg:px-8 xl:px-16 ">
                        {allMessages.map((m, msgIndex, arr) => (
                            <div
                                key={m.id || msgIndex}
                                id={`msg-${msgIndex}`}
                                className={cn(
                                    'pt-8 flex flex-col space-y-4 w-full',
                                    `${msgIndex === arr.length - 1 ? 'pb-32' : ''}`
                                )}
                            >
                                {(allMessages[msgIndex - 1]?.role || "") !== m.role && (
                                    <>
                                        {m.role === "user" ? (
                                            <UserNav session={session.data as Session} />
                                        ) : (
                                            <Button
                                                variant="outline"
                                                className="relative h-8 w-8 rounded-full"
                                            >
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={getFile(room?.avatar || "", "")} alt="Avatar" />
                                                    <AvatarFallback className="bg-transparent">AI</AvatarFallback>
                                                </Avatar>
                                            </Button>
                                        )}
                                    </>
                                )}

                                {m.content && (<Markdown content={m.content} />)}

                                {m?.experimental_attachments
                                    ?.filter(attachment =>
                                        attachment?.contentType?.startsWith('image/'),
                                    )
                                    .map((attachment, index) => (
                                        <div
                                            key={`${m.id || index}-${index}`}
                                            className='w-20 h-20'>
                                            <img
                                                src={attachment.url.startsWith("data") ? attachment.url : getFile(attachment.url, "")}
                                                className='h-full w-full object-contain'
                                                alt={attachment.name}
                                            />
                                        </div>
                                    ))}

                                {/* Invocation tools */}
                                {m.toolInvocations?.map((toolInvocation: ToolInvocation) => {
                                    const toolCallId = toolInvocation.toolCallId;
                                    return <Tools key={toolCallId} toolInvocation={toolInvocation} addToolResult={addToolResult} />
                                })}

                                {(!m.toolInvocations && (allMessages[msgIndex + 1]?.role || "") !== m.role) && (
                                    <div className="pt-2">
                                        <Separator className='h-0.5 ' />
                                    </div>
                                )}
                            </div>
                        ))}

                        {showScrollBottom && (
                            <div
                                onClick={() => scrollToBottom()}
                                className="cursor-pointer absolute z-20 right-1/2 translate-x-1/2 bottom-16">
                                <div className="bg-white rounded-xl p-1 shadow-xl animate-bounce">
                                    <ArrowDown
                                        size={24}
                                        className="text-black"
                                    />
                                </div>
                            </div>
                        )}

                        <ChatInput
                            onSubmit={onSubmit}
                            input={input}
                            handleInputChange={handleInputChange}
                            handleFileChange={handleFileChange}
                            files={files}
                            fileInputRef={fileInputRef}
                        />
                    </div>
                ) : (
                    <RoomSetting
                        roomInfo={room}
                    />
                )}

            </ScrollArea>
        </div>

    )
};


export default ChatContent;