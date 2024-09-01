"use client";

import { useSession } from "next-auth/react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

type ContentProps = {
    children: ReactNode;
    title: string;
    description: string;
}

function ChildrenWrapper({ children, title, description }: ContentProps) {
    return (
        <div className="w-full h-full px-2 flex justify-between items-center">
            <div>
                <h2 className="text-lg font-semibold">{title}</h2>
                <p className="text-sm text-gray-500">{description}</p>
            </div>
            {children}
        </div>
    )
}

const mouseHoverClass = "cursor-pointer transition-all duration-300 hover:scale-105";

function Content() {
    const session = useSession();

    if (!session.data) return null;

    const items = [
        {
            title: "Dashboard",
            path: "/dashboard",
            description: "Welcome back, " + session.data.user.name,
            children: (
                <img
                    src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Astonished%20Face.png"
                    alt="Astonished Face"
                    width="60" height="60"
                />
            )
        },
        {
            title: "Background Removal",
            path: "/background-removal",
            description: `Remove background from your images`,
            children: (
                <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Camera%20with%20Flash.png"
                    alt="Camera with Flash"
                    width="60" height="60"
                />
            )
        },
        {
            title: "Storage",
            path: "/storage",
            description: `Go to your storage`,
            children: (
                <img
                    src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Package.png"
                    alt="Package" width="60" height="60"
                />
            )
        },
        {
            title: "Chat",
            path: "/chat",
            description: `Chat with your network`,
            children: (
                <img
                    src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Inbox%20Tray.png"
                    alt="Inbox Tray" width="60" height="60" />
            )
        },
        {
            title: "Talk with AI",
            path: "/mic",
            description: `Voice conversation with AI`,
            children: (
                <img
                    src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Astronaut.png"
                    alt="Astronaut" width="60" height="60"
                />
            )
        },
        {
            title: "Blog",
            path: "/blog/e",
            description: `Manage your blog`,
            children: (
                <img
                    src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Bookmark%20Tabs.png"
                    alt="Bookmark Tabs"
                    width="60" height="60"
                />
            )
        },
        {
            title: "Setting & Account",
            path: "/setting",
            description: `Setting application and your account`,
            children: (
                <img
                    src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Gear.png"
                    alt="Gear"
                    width="60"
                    height="60"
                />
            )
        },
        {
            title: "Web crawler",
            path: "/crawler",
            description: `Crawl a website`,
            children: (
                <img
                    src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Spider%20Web.png"
                    alt="Spider Web"
                    width="60"
                    height="60"
                />
            )
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0 sm:gap-4">
            {items.map((item, index) => (
                <Link
                    href={item.path}
                    key={index}
                    className="h-full"
                >
                    <Card
                        className="h-[86px] sm:h-[112px] md:h-[140px] lg:h-[180px] rounded-lg border-none mt-6">
                        <CardContent className={cn("p-6 h-full", mouseHoverClass)}>
                            <div className="flex justify-center items-center h-full">
                                <ChildrenWrapper
                                    title={item.title}
                                    description={item.description}
                                >
                                    {item.children}
                                </ChildrenWrapper>

                            </div>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    );

};


export default Content;