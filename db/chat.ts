import { CHAT_ROUTES } from "@/routes"
import { CreateChatRoomSchema, UpdateAvatar } from "@/schemas"
import { Room } from "@/types"
import axios from "axios"
import { z } from "zod"
import { ResponseUpload, uploadFile } from "./upload"
import { Message } from "ai"
import { dataUrlToFile } from "@/lib/utils"

/* 
    AI Chat Room
*/
export const getUserAIChats = async (userId: string): Promise<Room[]> => {
    try {
        const response = await axios.get<{ rooms: Room[] }>(`${CHAT_ROUTES.userAIChats}/${userId}`)
        return response.data.rooms
    } catch (error) {
        console.error(error)
        return []
    }
}

export const getAIChatRoom = async (roomId: string): Promise<Room | null> => {
    try {
        const response = await axios.get<{ room: Room }>(`${CHAT_ROUTES.aiChat}/${roomId}`)
        return response.data.room
    } catch (error) {
        console.error(error)
        return null
    }
}

export const createAIChatRoom = async (userIds: string[], roomName: string = "Untitled"): Promise<Room | null> => {
    const validatedFields = CreateChatRoomSchema.safeParse({ userIds, name: roomName });
    if (!validatedFields.success) {
        console.log(validatedFields.error.message)
        console.error(validatedFields.error);
        return null;
    }
    try {
        const res = await axios.post<{ room: Room }>(CHAT_ROUTES.aiChat, { userIds, name: roomName }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return res.data.room;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const updateAIChatRoom = async (roomId: string, payload: Partial<Room>): Promise<Room | null> => {
    try {
        const response = await axios.put<{ room: Room }>(`${CHAT_ROUTES.aiChat}/${roomId}`, payload, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.data.room;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const deleteAIChatRoom = async (roomId: string) => {
    try {
        const response = await axios.delete(`${CHAT_ROUTES.aiChat}/${roomId}`);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const appendMessageAIRoom = async (id: string, payload: Message): Promise<void> => {
    try {
        const copy: Message = JSON.parse(JSON.stringify(payload));
        if (copy.experimental_attachments) {
            const processedAttachments = await Promise.all(
                copy.experimental_attachments.map(async (file, index) => {
                    try {
                        const fileObject = await dataUrlToFile(file.url, `image-${index}.png`);
                        const response = await uploadFile(fileObject, `chat/${id}`);

                        if (response.storePath) {
                            return {
                                ...file,
                                url: response.storePath
                            };
                        }
                    } catch (error) {
                        console.error(error);
                    }
                    return file;
                })
            );
            copy.experimental_attachments = processedAttachments;
        }


        const response = await axios.put(CHAT_ROUTES.aiChat + "/" + id, { message: payload }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
}


/* 
    Chat Room
*/

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
    console.log("roomId", roomId)
    try {
        const response = await axios.get<{ room: Room }>(`${CHAT_ROUTES.chat}/${roomId}`)
        return response.data.room
    } catch (error) {
        console.error(error)
        return null
    }
}

export const createChatRoom = async (userIds: string[], roomName: string): Promise<Room | null> => {
    const validatedFields = CreateChatRoomSchema.safeParse({ userIds, name: roomName });
    if (!validatedFields.success) {
        console.log(validatedFields.error.message)
        console.error(validatedFields.error);
        return null;
    }
    try {
        const res = await axios.post<{ room: Room }>(CHAT_ROUTES.chat, { userIds, name: roomName }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return res.data.room;
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

export const deleteChatRoom = async (roomId: string) => {
    try {
        const response = await axios.delete(`${CHAT_ROUTES.chat}/${roomId}`);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}