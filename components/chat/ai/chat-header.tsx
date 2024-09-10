"use client";

import { Card, CardContent } from "@/components/ui/card";
import { EnhanceButton } from "@/components/ui/enhance-button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Room } from "@/types";
import Link from "next/link";


type ChatHeaderProps = {
    room: Room
    showSetting: boolean
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ room, showSetting }) => {
    return (
        <Card className="md:mx-8">
            <CardContent className='flex px-4 py-2'>
                <div className='flex space-x-4'>
                    <Link
                        href={`/chat/ai/${room?.id}`}
                    >
                        <EnhanceButton
                            className={cn(
                                'rounded-full',
                                `${!showSetting ? 'bg-primary text-white dark:text-primary-foreground dark:bg-primary/90' : ''}`
                            )}
                            variant={"outline"}
                            size={"sm"}
                        >
                            Chat
                        </EnhanceButton>
                    </Link>
                    <Link
                        href={`/chat/ai/${room?.id}?setting=true`}
                    >
                        <EnhanceButton
                            className={cn(
                                'rounded-full',
                                `${showSetting ? 'bg-primary text-white dark:text-primary-foreground dark:bg-primary/90' : ''}`
                            )}
                            variant={"outline"}
                            size={"sm"}
                        >
                            Setting
                        </EnhanceButton>
                    </Link>
                    <Separator
                        orientation="vertical"
                    />
                </div>
                <p className='my-auto text px-4 text-gray-600'>{room?.name || ""}</p>
            </CardContent>
        </Card>
    )
};

export default ChatHeader;