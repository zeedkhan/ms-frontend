import { BLOG_ROUTES } from "@/routes"
import { blogSchema } from "@/schemas";
import { Blog } from "@/types"
import axios from "axios"
import { z } from "zod";

type Response = {
    success?: string;
    error?: string
    data?: any
}

const getBlogPath = async (seoPath: string): Promise<Blog | null> => {
    try {
        const request = await axios.get(`${BLOG_ROUTES.seoPathCheck}/${seoPath}`);
        return request.data;
    } catch (err) {
        console.error(err);
        return null;
    }
}

const getBlogById = async (id: string): Promise<Blog | null> => {
    try {
        const request = await axios.get(`${BLOG_ROUTES.blog}/${id}`)
        return request.data.blog;
    } catch (err) {
        console.error(err)
        return null
    }

}

const getBlogs = async (): Promise<Blog[]> => {
    try {
        const request = await axios.get(`${BLOG_ROUTES.blog}`)
        return request.data
    } catch (err) {
        console.error(err)
        return []
    }
}

// get user's blogs
const getUserBlogs = async (userId: string): Promise<Blog[]> => {
    try {
        const request = await axios.get(`${BLOG_ROUTES.blog}/user/${userId}`);
        return request.data.blogs;

    } catch (err) {
        console.error(err);
        return [];
    }
};


// create a new blog
const createBlog = async (payload: z.infer<typeof blogSchema>): Promise<Response> => {
   
    const validatedFields = blogSchema.safeParse(payload);

    if (!validatedFields.success) {
        return { error: "Invalid fields!", data: validatedFields.error.errors };
    }

    console.log("Create payload", payload)
   
    try {
        const request = await axios.post(`${BLOG_ROUTES.blog}`, payload);
        if (request.data.error) {
            return {
                error: request.data.error
            }
        }
        return {
            success: "Created!",
            data: request.data
        }
    } catch (err) {
        console.error(err)
        return {
            error: "something went wrong!"
        }
    }
};

// update a blog
const updateBlog = async (payload: z.infer<typeof blogSchema>): Promise<Response> => {
    const validatedFields = blogSchema.safeParse(payload);
    if (!validatedFields.success) {
        return { error: "Invalid fields!", data: validatedFields.error.errors };
    }

    try {
        const request = await axios.put(`${BLOG_ROUTES.blog}/${payload.id}`, payload);
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


// delete a blog
const deleteBlog = async (id: string): Promise<Response> => {
    try {
        const request = await axios.delete(`${BLOG_ROUTES.blog}/${id}`);

        console.log("request", request)
        return {
            success: "Deleted!"
        }
    } catch (err) {
        console.error(err)
        return {
            error: "something went wrong!"
        }
    }
};

export {
    getBlogById,
    getBlogs,
    getUserBlogs,
    createBlog,
    updateBlog,
    deleteBlog,
    getBlogPath
}