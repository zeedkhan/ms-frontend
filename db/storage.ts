import { UPLOAD_ROUTES } from "@/routes";
import { MoveFilesToDirectorySchema, UploadFileToStorage } from "@/schemas";
import { StorageFile } from "@/types"
import axios from "axios";
import { z } from "zod"


type Response = {
    success?: string;
    error?: string
}


type GetFileId = {
    successs?: StorageFile
    error?: string
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

export const getUserStorageWithNoDirectory = async (userId: string): Promise<StorageFile[]> => {
    try {
        const request = await axios.get<{ data: StorageFile[] }>(`${UPLOAD_ROUTES.userStorageNoDirectory}/${userId}`);
        return request.data.data;
    } catch (err) {
        console.error(err)
        return []
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
};

export const moveStorageFilesToDirectory = async (
    payload: z.infer<typeof MoveFilesToDirectorySchema>
): Promise<Response> => {
    const valudatedFields = MoveFilesToDirectorySchema.safeParse(payload);
    if (!valudatedFields.success) {
        return { error: "Invalid fields!" };
    }
    try {
        const request = await axios.put(`${UPLOAD_ROUTES.moveStorage}`, {
            ids: payload.ids,
            directoryId: payload.directoryId
        });
        console.log("request", request)
        return {
            success: "Updated!"
        }
    } catch (err) {
        console.error(err)
        return {
            error: "something went wrong!"
        }
    }
};

export const moveDirectory = async (
    payload: z.infer<typeof MoveFilesToDirectorySchema>
): Promise<Response> => {
    const valudatedFields = MoveFilesToDirectorySchema.safeParse(payload);
    if (!valudatedFields.success) {
        return { error: "Invalid fields!" };
    }
    try {
        const request = await axios.put(`${UPLOAD_ROUTES.moveDirectory}`, {
            ids: payload.ids,
            directoryId: payload.directoryId
        });
        console.log("request", request)
        return {
            success: "Updated!"
        }
    } catch (err) {
        console.error(err)
        return {
            error: "something went wrong!"
        }
    }
};

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
};

export const deleteStorageFile = async (fileId: string): Promise<{ success?: string, error?: string }> => {
    try {
        const request = await axios.delete<Response>(`${UPLOAD_ROUTES.getFileId}/${fileId}`);
        if (request.data.success) {
            return {
                success: request.data.success,
            }
        }
        if (request.data.error) {
            return {
                error: request.data.error
            }
        }
        return {
            error: "Something went wrong!"
        }
    } catch (err) {
        console.error(err)
        return {
            error: "Something went wrong!"
        }
    }
}