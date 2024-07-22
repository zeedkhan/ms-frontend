"use client";

import { OutputData } from "@editorjs/editorjs";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";
import SaveBlog from "./save-blog";
import { Blog } from "@/types";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { duplicatedSeoPath } from "@/db/blog";

let Editor = dynamic(() => import("./editor"), {
    ssr: false,
});

type BlogEditor = {
    blog: Blog
    blogId: string | null
}

const menus = [
    {
        title: "Editor",
    },
    {
        title: "Settings",
    },
]


const NewEditor = ({ blog, blogId }: BlogEditor) => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const { data: session, status } = useSession();

    const [content, setContent] = useState(blog.content as OutputData);
    const [title, setTitle] = useState(blog.title);
    const [description, setDescription] = useState(blog.description);
    const [seoPath, setSeoPath] = useState(blog.seoPath);
    const [selectIndex, setSelectIndex] = useState(searchParams.get("editor") === "settings" ? 1 : 0);

    // duplicated path name
    const [isDuplicateSeoPath, setIsDuplicateSeoPath] = useState<null | boolean>(null);

    const payload = useMemo(() => {
        return {
            title: title,
            userId: session?.user.id as string,
            description: description,
            content: content,
        }

    }, [title, description, content, session]);

    useEffect(() => {
        const params = new URLSearchParams(searchParams);
        params.set("editor", menus[selectIndex].title.toLowerCase());
        replace(`${pathname}?${params.toString()}`);

    }, [selectIndex]);


    useEffect(() => {
        const time = setTimeout(() => {
            const newPath = seoPath.trim().replace(/\s+/g, '-').toLowerCase();
            if (!!newPath) {
                setSeoPath(newPath);
                duplicatedSeoPath(newPath).then(setIsDuplicateSeoPath);
            } 
        }, 1000);

        return () => {
            clearTimeout(time);
        }
    }, [seoPath])


    if (!session) {
        return null
    };

    return (
        <div>
            <div className="px-6 w-full flex items-center space-x-4 justify-between">
                <div className="flex space-x-4 justify-center">
                    {menus.map((menu, index) => (
                        <Card
                            onClick={() => setSelectIndex(index)}
                            className={cn(
                                "px-4 py-0.5 cursor-pointer",
                                `${selectIndex === index ? "bg-green-300 dark:text-black" : ""}`)} key={index}>
                            <p>{menu.title}</p>
                        </Card>
                    ))}

                </div>
                <SaveBlog payload={payload} userId={session.user.id} blogId={blogId} />

            </div>

            {
                selectIndex === 0 && (
                    <Editor
                        holder="editor_create"
                        onChange={(e: any) => setContent(e)}
                        data={content}
                        userId={session.user.id}
                        blogId={blogId}
                    />
                )
            }

            {
                selectIndex === 1 && (
                    <div className="flex flex-col  space-y-4 pt-4 justify-center">
                        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                        <div className="w-1/2">
                            <Textarea
                                onChange={(e) => setDescription(e.target.value)}
                                value={description}
                                placeholder="Add a description" />
                        </div>

                        {isDuplicateSeoPath !== null && isDuplicateSeoPath && (
                            <p className="text-red-500">Seo path already exists</p>
                        )}

                        {isDuplicateSeoPath !== null && !isDuplicateSeoPath && (
                            <p className="text-green-500">Seo path is available</p>
                        )}

                        <Input value={seoPath} onChange={(e) => {
                            setSeoPath(e.target.value);
                            setIsDuplicateSeoPath(null);
                        }} placeholder="seo-path" />
                    </div>
                )
            }

        </div>
    )

}

export default NewEditor;


