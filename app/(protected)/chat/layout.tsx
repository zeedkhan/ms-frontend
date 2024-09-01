import DisplayRooms from "@/components/chat/rooms";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Chats",
};

export default function ChatLayout({ children }: { children: React.ReactNode }) {
    return (
        <Card
            className={cn(
                "flex",
                "h-[calc(100vh-56px)] md:h-[calc(100vh-112px)]",
            )}
        >
            <DisplayRooms />
            {children}
        </Card>
    )
}