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
import { getBlogPath } from "@/db/blog";
import { Button } from "../ui/button";
import Link from "next/link";
import { EnhanceButton } from "../ui/enhance-button";
import { Eye, PenLine, Wrench } from "lucide-react";

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
        icon: PenLine
    },
    {
        title: "Settings",
        icon: Wrench
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
            seoPath: seoPath,
            version: 1,
        }

    }, [title, description, content, session, seoPath]);

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
                getBlogPath(newPath).then((res) => {
                    setIsDuplicateSeoPath(res ? true : false);
                });
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
            <div className="overflow-x-auto overflow-hidden py-1 px-6 w-full flex items-center space-x-4 justify-between">
                <div className="flex space-x-4 justify-center">

                    <div className="flex space-x-4 justify-center">
                        {menus.map((menu, index) => (
                            <EnhanceButton
                                variant={"outline"}
                                size={"sm"}
                                key={index}
                                className={cn(
                                    `shadow rounded-full`,
                                    selectIndex === index ? "bg-green-300 dark:text-black dark:hover:text-black dark:hover:bg-green-300" : ""
                                )}
                                onClick={() => setSelectIndex(index)}
                            >
                                <div className="flex items-center space-x-2">
                                    <menu.icon size={18} />
                                    <p>{menu.title}</p>
                                </div>
                            </EnhanceButton>
                        ))}
                    </div>
                </div>

                <div className="flex space-x-4">
                    {blogId && (
                        <EnhanceButton
                            variant={"outlineExpandIcon"}
                            iconPlacement="left"
                            Icon={Eye}
                            size={"sm"}
                            className="shadow rounded-full "
                        >
                            <Link
                                href={process.env.NEXT_PUBLIC_DOMAIN + `/blog/${blog.seoPath}`}
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                Preview
                            </Link>
                        </EnhanceButton>
                    )}
                    <SaveBlog payload={payload} userId={session.user.id} blogId={blogId} />
                </div>
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

                        {blog.seoPath !== seoPath && isDuplicateSeoPath !== null && isDuplicateSeoPath && (
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


