import BlogId from "@/components/blog/blogId";
import { getBlogPath } from "@/db/blog";
import { Metadata, ResolvingMetadata } from "next";
import Scroll from "./_scroll";
import { getFile } from "@/lib/utils";

export async function generateMetadata(
    { params, searchParams }: { params: { id: string }; searchParams: URLSearchParams },
    parent: ResolvingMetadata
): Promise<Metadata> {
    const id = params.id
    const blog = await getBlogPath(id);
    return {
        title: blog?.seoPath || "",
        description: blog?.description || "",
        keywords: blog?.keywords || [],
        openGraph: {
            title: blog?.title || "",
            description: blog?.description || "",
            images: [{ url: getFile(blog?.ogImage, ""), alt: blog?.seoPath || "" }],
            modifiedTime: blog?.createdAt || "",
            type: (blog?.ogType || "article") as "website" | "article",
        },
    }
}

const Page = async ({ params }: { params: any }) => {
    const { id } = params;
    const blog = await getBlogPath(id);

    if (!blog) {
        return null;
    }
    return (
        <>
            <Scroll />
            <BlogId
                title={blog.title}
                content={blog.content}
                ogImage={blog.ogImage}
            />
        </>
    )
}

export default Page;