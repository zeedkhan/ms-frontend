"use client";

import { createBlog, updateBlog } from "@/db/blog";
import { OutputData } from "@editorjs/editorjs";
import { toast } from "sonner"
import { blogSchema } from "@/schemas";
import { useRouter } from "../loader/use-router";
import { EnhanceButton } from "../ui/enhance-button";
import { CirclePlus } from "lucide-react";
import { z } from "zod";

type SaveBlogProps = {
    payload: z.infer<typeof blogSchema>
    blogId: string | null,
    userId: string;
} & React.HTMLProps<HTMLButtonElement>;

const SaveBlog: React.FC<SaveBlogProps> = ({ payload, blogId, disabled, ...res }) => {

    const router = useRouter();

    const create = async (updateObject: z.infer<typeof blogSchema>) => {
        // save in database
        const validatedFields = blogSchema.safeParse({
            ...payload,
            ...updateObject,
        });

        if (!validatedFields.success) {
            console.log(validatedFields.error.errors)
            toast.error(JSON.stringify(validatedFields.error.errors))
            return;
        }

        try {
            const blog = await createBlog({
                content: updateObject.content,
                description: updateObject.description || "",
                title: updateObject.title,
                userId: updateObject.userId,
                seoPath: updateObject.seoPath,
                version: 1,
            });
            if (blog.error) {
                toast.error(JSON.stringify(blog.error))
            }
            if (blog.success) {
                toast.success("Blog created!");
                return blog;
            }
        } catch (err) {
            toast.error(JSON.stringify(err))
            return {
                error: "something went wrong!"
            }
        }
    }

    const edit = async (updateObject: z.infer<typeof blogSchema>) => {
        // update in database
        try {
            const blog = await updateBlog({
                ...payload,
                ...updateObject,
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
                    const createBlog = await create(payload)
                    if (createBlog?.data) {
                        console.log(createBlog.data)
                        router.push(`/blog/e/${createBlog.data.blog.id}`);
                    }
                    return;
                }
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
        <EnhanceButton
            variant={"outlineExpandIcon"}
            iconPlacement="left"
            Icon={CirclePlus}
            size={"sm"}
            disabled={disabled}
            className="shadow rounded-full w-fit min-w-20" onClick={handleSave}
        >
            {!blogId ? "Create" : "Update"}
        </EnhanceButton>
    );
}



export default SaveBlog;
