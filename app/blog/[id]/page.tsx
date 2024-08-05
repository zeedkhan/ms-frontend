import BlogId from "@/components/blog/blogId";
import { getBlogPath } from "@/db/blog";
import { Metadata, ResolvingMetadata } from "next";
import Scroll from "./_scroll";

export async function generateMetadata(
    { params, searchParams }: { params: { id: string }; searchParams: URLSearchParams },
    parent: ResolvingMetadata
): Promise<Metadata> {
    const id = params.id

    const blog = await getBlogPath(id);

    return {
        title: blog?.seoPath || "",
        // openGraph: {},
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
            <BlogId content={blog.content} />
        </>
    )
}

export default Page;