"use client";

import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { EnhanceButton } from "@/components/ui/enhance-button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import RoomInfoSetting from "./room-info-setting";
import { Room } from "@/types";
import { cn } from "@/lib/utils";

type RoomSettingProps = {
    roomInfo: Room | null;
}

const RoomSetting: React.FC<RoomSettingProps> = ({ roomInfo }) => {
    const [selectIndex, setSelectIndex] = useState(0);
    return (
        <Card className="mt-8">
            <CardHeader>
                <div className="flex flex-col space-y-1">
                    <p className="text-2xl font-semibold">Settings</p>
                    <CardDescription>
                        Manage AI Chat Setting
                    </CardDescription>
                </div>

                <div className="py-4">
                    <Separator orientation="horizontal" className="" />
                </div>

                <div className="flex space-x-2">
                    <EnhanceButton
                        variant={"ghost"}
                        className={cn(
                            selectIndex === 0 ? "bg-accent text-accent-foreground" : ""
                        )}
                        onClick={() => setSelectIndex(0)}
                    >
                        Info
                    </EnhanceButton>

                    <EnhanceButton variant={"ghost"}>
                        Knowledge Base
                    </EnhanceButton>
                </div>
            </CardHeader>
            <CardContent>
                {roomInfo && selectIndex === 0 && <RoomInfoSetting roomInfo={roomInfo} />}
            </CardContent>
        </Card>
    )
};


export default RoomSetting;