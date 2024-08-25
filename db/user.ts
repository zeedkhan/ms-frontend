import { AUTH_ROUTES, UPLOAD_ROUTES } from "@/routes"
import { UpdateAvatar, UpdateUserSchema } from "@/schemas"
import { User } from "@/types"
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