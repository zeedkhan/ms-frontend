"use client";

import { createBlog, updateBlog } from "@/db/blog";
import { OutputData } from "@editorjs/editorjs";
import { Button } from "../ui/button";
import { toast } from "sonner"
import { blogSchema } from "@/schemas";

type SaveBlogProps = {
    payload: SaveData
    blogId: string | null,
    userId: string;
} & React.HTMLProps<HTMLButtonElement>;

type SaveData = {
    title: string,
    id?: string,
    userId: string,
    version: string | number,
    content: OutputData,
    description: string,
    seoPath: string,
}

const SaveBlog: React.FC<SaveBlogProps> = ({ payload, blogId, disabled, ...res }) => {

    const create = async ({ seoPath, title, userId, version = 1, content, description = "" }: SaveData) => {
        // save in database
        const validatedFields = blogSchema.safeParse({
            ...payload,
            seoPath: seoPath,
            title: title,
            version: version,
            content: content,
            description: description,
            userId: userId,
        });

        if (!validatedFields.success) {
            console.log(validatedFields.error.errors)
            toast.error(JSON.stringify(validatedFields.error.errors))
            return;
        }

        try {
            const blog = await createBlog({
                content: content,
                description: description,
                title: title,
                userId: userId,
                version: 1,
                seoPath: seoPath,
            });
            if (blog.error) {
                toast.error(JSON.stringify(blog.error))
            }
            if (blog.success) {
                toast.success("Blog created!");
            }
        } catch (err) {
            toast.error(JSON.stringify(err))
            return {
                error: "something went wrong!"
            }
        }
    }

    const edit = async ({ seoPath, id, title, userId, version = 1, content, description = "" }: SaveData) => {
        // update in database
        try {
            const blog = await updateBlog({
                ...payload,
                id: id,
                seoPath: seoPath,
                title: title,
                version: Number(version),
                content: content,
                description: description,
                userId: userId,
            });
            if (blog.error) {
                toast.error(JSON.stringify(blog.error))
            }
            if (blog.success) {
                toast.success("Blog updated!");
            }
        } catch (err) {
            toast.error(JSON.stringify(err))
            return {
                error: "something went wrong!"
            }
        }
    }

    const handleSave = async () => {
        if (payload) {
            // create or update
            // promise 
            // return success or error with toast63.
            try {
                if (!blogId) {
                    console.log("Create")
                    return await create(payload)
                }
                console.log("Edit")

                const editBlog = await edit({
                    ...payload,
                    id: blogId,
                })

                if (editBlog?.error) {
                    toast.error(JSON.stringify(editBlog.error))
                }
            }
            catch (err) {
                console.error(err)
                toast.error(JSON.stringify(err))
            }
        }
    };


    return (
        <Button
            disabled={disabled}
            className="w-fit min-w-20" onClick={handleSave}
        >
            {!blogId ? "Save" : "Update"}
        </Button>
    );
}



export default SaveBlog;
