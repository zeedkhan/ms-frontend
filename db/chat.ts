import { CHAT_ROUTES } from "@/routes"
import { createChatRoomSchema, UpdateAvatar } from "@/schemas"
import { AtLeast, Room } from "@/types"
// import { Blog } from "@/types"
import axios from "axios"
import { z } from "zod"
import { ResponseUpload } from "./upload"

export const getUserChats = async (userId: string): Promise<Room[]> => {
    try {
        const response = await axios.get<{ rooms: Room[] }>(`${CHAT_ROUTES.userChats}/${userId}`)
        return response.data.rooms
    } catch (error) {
        console.error(error)
        return []
    }
}

export const getChatRoom = async (roomId: string): Promise<Room | null> => {
    try {
        const response = await axios.get<{ room: Room }>(`${CHAT_ROUTES.chat}/${roomId}`)
        return response.data.room
    } catch (error) {
        console.error(error)
        return null
    }
}

export const createChatRoom = async (userIds: string[], roomName: string): Promise<Room | null> => {
    const validatedFields = createChatRoomSchema.safeParse({ userIds, name: roomName });
    if (!validatedFields.success) {
        console.log(validatedFields.error.message)
        console.error(validatedFields.error);
        return null;
    }
    try {
        const res = await axios.post(CHAT_ROUTES.chat, { userIds, name: roomName }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return res.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const updateChatAvatar = async (
    payload: z.infer<typeof UpdateAvatar>): Promise<ResponseUpload> => {
    const validatedFields = UpdateAvatar.safeParse(payload);
    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    try {
        const response = await axios.put(`${CHAT_ROUTES.editChatAvatar}/${payload.id}`, {
            path: payload.path
        });

        if (response.statusText === "OK") {
            return { success: "Updated!" };
        }
        return { error: "Failed to update!" };

    } catch (err) {
        console.log("Error", err)
        console.error(err)
        return {
            error: "something went wrong!"
        }
    }
}