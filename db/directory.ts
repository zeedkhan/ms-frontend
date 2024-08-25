import { UPLOAD_ROUTES } from "@/routes"
import { CreateDirectorySchema } from "@/schemas";
import { Directory, StorageFile } from "@/types"
import axios from "axios"
import { z } from "zod";

export const createDirectory = async (payload: z.infer<typeof CreateDirectorySchema>): Promise<any> => {
    const validatedFields = CreateDirectorySchema.safeParse(payload);
    if (!validatedFields.success) {
        console.log(validatedFields.error.message)
        console.error(validatedFields.error);
        return null;
    }
    try {
        const request = await axios.post<{ data: Directory }>(`${UPLOAD_ROUTES.directory}`, payload);
        return request.data.data
    } catch (err) {
        console.error(err)
        return [];
    }
}

export const getUserDirectory = async (userId: string): Promise<Directory[]> => {
    try {
        const request = await axios.get<{ data: Directory[] }>(`${UPLOAD_ROUTES.userDirectory}/${userId}?withParent=false`);
        return request.data.data;
    } catch (err) {
        console.error(err)
        return [];
    }
};

type SearchResponse = { directories: Directory[], files: StorageFile[] }

export const search = async (params: string): Promise<SearchResponse> => {
    try {
        const request = await axios.get<SearchResponse>(`${UPLOAD_ROUTES.searchDirectoryAndStorage}?${params}`);
        return { directories: request.data.directories || [], files: request.data.files || [] }
    } catch (err) {
        console.error(err)
        return { directories: [], files: [] }
    }
}

export const getDirectoryId = async (directoryId: string): Promise<Directory | null> => {
    try {
        const request = await axios.get<{ data: Directory }>(`${UPLOAD_ROUTES.directory}/${directoryId}`);
        return request.data.data;
    } catch (err) {
        console.error(err)
        return null
    }
};

export const deleteDirectory = async (directoryId: string): Promise<boolean> => {
    try {
        const request = await axios.delete(`${UPLOAD_ROUTES.directory}/${directoryId}`);
        return true
    } catch (err) {
        console.error(err)
        return false
    }
}