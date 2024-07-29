import { cn, getFile, waitForElm } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Avatar, AvatarImage } from "../../components/ui/avatar";
import { ArrowDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { Message, RoomUsers } from "@/types";
import MessageFile from "./message-file";


type ChatListProps = {
    messages: Message[];
    users: RoomUsers[];
    userId: string
}

export function ChatList({ messages = [], users = [], userId }: ChatListProps) {
    const [showScrollBottom, setShowScrollToBottom] = useState<boolean>(!!messages.length);
    const [userImages, setUserImages] = useState(new Map<string, string>());

    const n = messages.length || 0;
    const pathname = useRouter();

    const scrollToBottom = (): void => {
        if (!messages || n === 0) return;
        const lastMessage = messages[n - 1];
        waitForElm(`#msg-${lastMessage.id}`).then(() => {
            document.getElementById(`msg-${lastMessage?.id}`)?.scrollIntoView({ behavior: "smooth" });
            setShowScrollToBottom(true);
        });
    }

    useEffect(() => {
        if (messages.length === 0) return;

        // Use Intersection Observer to check if the last message is visible
        const lastMessageEl = document.querySelector(`#msg-${messages[n - 1].id}`) as Element;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setShowScrollToBottom(false);
                } else {
                    setShowScrollToBottom(true);
                }
            });
        });

        users.forEach((user) => {
            setUserImages((u) => u.set(user.userId, user.user.image || ""));
        });

        observer.observe(lastMessageEl);
    }, [messages, users]);


    useEffect(() => {
        if (messages.length === 0) return;
        scrollToBottom();
    }, [pathname])


    const avatar = (message: Message) => {
        const dumpUrl = "https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/batman_hero_avatar_comics-512.png"
        if (!message.userId) return dumpUrl;
        if (message.user && message.user.image) return getFile(message.user.image, dumpUrl);
        if (userImages.has(message.userId)) return getFile(userImages.get(message.userId), dumpUrl);
        return dumpUrl;
    };

    if (!userId || messages.length === 0) return null

    return (
        <div
            style={{ height: "calc(100% - 80px)" }}
            className="pt-16 w-full overflow-y-auto overflow-x-hidden flex flex-col">
            <div
                className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col">

                {messages?.map((m, i) => (
                    <div key={i} className={cn("flex flex-col gap-2 p-4 whitespace-pre-wrap", m.userId !== userId ? "items-start" : "items-end")}>
                        <div className="flex gap-3 items-center" id={`msg-${m.id}`}>
                            {m.userId !== userId && (
                                <Avatar className="flex justify-center items-center">
                                    <AvatarImage
                                        src={avatar(m)}
                                        alt={"asd"}
                                        width={6}
                                        height={6}
                                    />
                                </Avatar>
                            )}
                            {m.type === "TEXT" && (
                                <span className="bg-accent p-3 rounded-md max-w-80 min-w-20 break-words">
                                    {m.text}
                                </span>
                            )}

                            {m.type === "FILE" && (
                                <MessageFile message={m} key={`file-${i}`} />
                            )}
                        </div>
                    </div>
                ))}

                {showScrollBottom && (
                    <div
                        onClick={() => scrollToBottom()}
                        className="cursor-pointer absolute z-20 right-1/2 translate-x-1/2 bottom-28">
                        <div className="bg-white rounded-xl p-1 shadow-xl animate-bounce">
                            <ArrowDown
                                size={24}
                                className="text-black"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}