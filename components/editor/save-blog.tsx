"use client";

import { createBlog, updateBlog } from "@/db/blog";
import { OutputData } from "@editorjs/editorjs";
import { Button } from "../ui/button";
import { toast } from "sonner"


type SaveBlogProps = {
    payload: SaveData
    blogId: string | null,
    userId: string;
}

type SaveData = {
    title: string,
    id?: string,
    userId: string,
    version?: number,
    content: OutputData,
    description: string
}


const SaveBlog: React.FC<SaveBlogProps> = ({ payload, blogId, userId }) => {

    const create = async ({ title, userId, version, content, description = "" }: SaveData) => {
        // save in database
        try {
            const blog = await createBlog({
                content: content,
                description: description,
                title: title,
                userId: userId,
                seoPath: "",
            });
            console.log(blog)
            return {
                success: "Created!"
            }
        } catch (err) {
            console.error(err)

            return {
                error: "something went wrong!"
            }
        }
    }

    const edit = async ({ id, title, userId, version, content, description = "" }: SaveData) => {
        // update in database
        try {
            const blog = await updateBlog({
                id: id,
                content: content,
                description: description,
                title: title,
                userId: userId,
                seoPath: "",
            });
            console.log(blog)
            return {
                success: "Updated!"
            }
        } catch (err) {
            console.error(err)
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
                return await edit({
                    ...payload,
                    id: blogId,
                })
            }
            catch (err) {
                console.error(err)
                toast.error("Something went wrong!")
            }
        }
    };


    return (
        <Button
            size={"sm"}
            className="w-fit min-w-20 text-base" onClick={handleSave}
        >
            Save
        </Button>
    );
}



export default SaveBlog;