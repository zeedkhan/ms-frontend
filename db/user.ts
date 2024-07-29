import { AUTH_ROUTES, UPLOAD_ROUTES } from "@/routes"
import { UpdateAvatar, UpdateUserSchema, UploadFileToStorage } from "@/schemas"
import { StorageFile, User } from "@/types"
import axios from "axios"
import { z } from "zod"

type Response = {
    success?: string;
    error?: string
}

export const getUser = async (userId: string): Promise<User | null> => {
    try {
        const request = await axios.get(`${AUTH_ROUTES.user}/${userId}`)
        return request.data
    } catch (err) {
        console.error(err)
        return null
    }
}

export const getAllUsers = async (): Promise<User[] | []> => {
    try {
        const request = await axios.get(`${AUTH_ROUTES.user}/`);
        return request.data.data
    } catch (err) {
        console.error(err)
        return []
    }
}

export const updateUser = async (
    payload: z.infer<typeof UpdateUserSchema>
): Promise<Response> => {

    const validatedFields = UpdateUserSchema.safeParse(payload);
    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    try {

        const { id } = validatedFields.data
        const request = await axios.put(`${AUTH_ROUTES.user}/${id}`, payload);
        return {
            success: "Updated!"
        }
    } catch (err) {
        console.log("Error", err)
        console.error(err)
        return {
            error: "something went wrong!"
        }
    }
}

export const updateUserAvatar = async (
    payload: z.infer<typeof UpdateAvatar>
): Promise<Response> => {

    const validatedFields = UpdateAvatar.safeParse(payload);
    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    try {
        const { path, id } = validatedFields.data
        const request = await axios.put(`${UPLOAD_ROUTES.editUserAvatar}/${id}`, {
            path: path
        });

        return {
            success: "Updated!"
        }
    } catch (err) {
        console.log("Error", err)
        console.error(err)
        return {
            error: "something went wrong!"
        }
    }
}

export const uploadFileToStorage = async (
    payload: z.infer<typeof UploadFileToStorage>
): Promise<Response> => {
    const validatedFields = UploadFileToStorage.safeParse(payload);
    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }
    try {
        const { userId } = validatedFields.data
        const request = await axios.post(`${UPLOAD_ROUTES.userStorage}/${userId}`, payload);

        console.log("request", request)
        return {
            success: "Updated!"
        }
    } catch (err) {
        console.log("Error", err)
        console.error(err)
        return {
            error: "something went wrong!"
        }
    }
}

export const getUserStorge = async (userId: string): Promise<StorageFile[]> => {
    try {
        const request = await axios.get<{ data: StorageFile[] }>(`${UPLOAD_ROUTES.userStorage}/${userId}`);
        return request.data.data;
    } catch (err) {
        console.error(err)
        return []
    }
};

type GetFileId = {
    successs?: StorageFile
    error?: string
}

export const getFileId = async (fileId: string, userId: string): Promise<GetFileId> => {
    try {
        const request = await axios.get<{ data: StorageFile }>(`${UPLOAD_ROUTES.getFileId}/${fileId}`);
        if (!request.data.data) {
            return {
                error: "Not found!"
            }
        }
        if (request.data.data.userId !== userId) {
            return {
                error: "Not authorized!"
            }
        }
        return {
            successs: request.data.data
        }
    } catch (err) {
        console.error(err)
        return {
            error: "Something went wrong!"
        }
    }
}