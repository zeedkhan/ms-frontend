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
import BlogSetting from "./blog-setting";

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

    const [keywords, setKeywords] = useState<string[]>(blog.keywords || []);

    // og image
    const [ogImage, setOgImage] = useState<string | undefined>(blog.ogImage || undefined);
    const [ogType, setOgType] = useState<string | undefined>(blog.ogType || "website");

    const payload = useMemo(() => {
        return {
            title: title,
            userId: session?.user.id as string,
            description: description,
            content: content,
            seoPath: seoPath,
            version: blog.version || 1,
            keywords: keywords.filter((keyword) => keyword.trim() !== ""),
            ogImage: ogImage,
            ogType: ogType
        }

    }, [title, description, content, session, seoPath, ogImage, ogType, keywords]);

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
                    <BlogSetting
                        blogId={blogId}

                        ogImage={ogImage}
                        setOgImage={setOgImage}

                        ogType={ogType}
                        setOgType={setOgType}

                        keywords={keywords}
                        setKeywords={setKeywords}

                        title={title}
                        setTitle={setTitle}
                        description={description}
                        setDescription={setDescription}
                        seoPath={seoPath}
                        prevSeoPath={blog.seoPath}
                        setSeoPath={setSeoPath}
                        isDuplicateSeoPath={isDuplicateSeoPath}
                        setIsDuplicateSeoPath={setIsDuplicateSeoPath}
                    />
                )
            }

        </div>
    )

}

export default NewEditor;


