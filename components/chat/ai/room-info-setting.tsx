"use client";

import { Button } from "@/components/ui/button";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { updateAIChatRoom } from "@/db/chat";
import { Room } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import AvatarInfoSetting from "./avatar-info-setting";
import { useStore } from "zustand";
import RoomStore from "@/state/room";

const RoomInfoSettingSchema = z.object({
    name: z.string(),
    // users: z.array(z.object({
    //     userId: z.string(),
    // })),
});

type RoomInfoSettingValues = z.infer<typeof RoomInfoSettingSchema>

type RoomInfoSettingProps = {
    roomInfo: Room;
}

const RoomInfoSetting: React.FC<RoomInfoSettingProps> = ({ roomInfo }) => {
    const updateRoom = useStore(RoomStore, (state) => state.updateRoom);
    const form = useForm<RoomInfoSettingValues>({
        defaultValues: RoomInfoSettingSchema.parse(roomInfo),
        resolver: zodResolver(RoomInfoSettingSchema),
        mode: "onChange"
    });

    async function onSubmit(data: RoomInfoSettingValues) {
        try {
            const response = await updateAIChatRoom(roomInfo.id, data);
            toast.success("Room Info Updated");
            updateRoom(roomInfo.id, data)
        } catch (err) {
            console.error(err);
            toast.error("Failed to update room info");
        }
    };

    return (
        <div>
            <div>
                <p>
                    Room Info Setting
                </p>
                <small className="text-gray-600">This is AI Chat Room setting</small>
            </div>

            <div className="py-5">
                <Separator orientation="horizontal" className="" />
            </div>

            <AvatarInfoSetting
                avatar={roomInfo.avatar}
                id={roomInfo.id}
            />

            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Chat room name</FormLabel>
                                <FormControl>
                                    <Input placeholder="shadcn" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is your chat room name
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit">Update profile</Button>
                </form>
            </FormProvider>

        </div>
    )
};

export default RoomInfoSetting;