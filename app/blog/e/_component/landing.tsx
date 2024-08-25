"use client";

import { Blog } from "@/types";
import { z } from "zod";
import { blogSchema, columns, } from "./column";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table/data-table";
import { useStore } from "zustand";
import { BlogStore } from "@/state/blog";
import { useEffect, useState } from "react";
import { EnhanceButton } from "@/components/ui/enhance-button";
import Link from "next/link";
import { deleteBlog } from "@/db/blog";
import { toast } from "sonner";

function Landing({ blogs }: { blogs: Blog[] }) {
    const storeBlogs = useStore(BlogStore, (state) => state.blogs);
    const [data, setData] = useState(z.array(blogSchema).parse(storeBlogs));
    const setBlogs = useStore(BlogStore, (state) => state.setBlogs);

    const removeBlog = useStore(BlogStore, (state) => state.removeBlog);

    const deleteBlogId = async (id: string) => {
        try {
            await deleteBlog(id);
            removeBlog(id);
            toast.success("Blog deleted!");
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        setBlogs(blogs);
    }, [blogs]);

    useEffect(() => {
        setData(z.array(blogSchema).parse(storeBlogs));
    }, [storeBlogs]);

    return (
        <Card className="p-8">
            <DataTable
                columns={columns}
                data={data}
                deleteFn={deleteBlogId}
                extraToolbar={
                    <Link
                        href={"/blog/e/new"}
                    >
                        <EnhanceButton
                            variant={"outline"}
                            className="h-[32px] text-xs"
                            size={"sm"}
                        >
                            New
                        </EnhanceButton>
                    </Link>
                }
            />
        </Card>
    )
}

export default Landing;