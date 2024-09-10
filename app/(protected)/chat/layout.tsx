import ListChat from "@/components/chat/list-chat";
import AdminPanelLayout from "@/components/layout/layout-wrapper";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Chats",
};

export default function ChatLayout({ children }: { children: React.ReactNode }) {
    return (
        <AdminPanelLayout>
            <Card
                className={cn(
                    "flex p-3 ",
                    "h-[calc(100vh-56px)] border-none shadow-none ",
                )}
            >
                <ListChat />
                {children}
            </Card>
        </AdminPanelLayout>
    )
}