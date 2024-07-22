import BlogId from "@/components/blog/blogId";
import { getBlogById } from "@/db/blog";
import { Metadata, ResolvingMetadata } from "next";


export async function generateMetadata(
    { params, searchParams }: { params: { id: string }; searchParams: URLSearchParams },
    parent: ResolvingMetadata
): Promise<Metadata> {
    const id = params.id

    const blog = await getBlogById(id);

    return {
        title: blog?.title || "",
        // openGraph: {},
    }
}

const Page = async ({ params }: { params: any }) => {
    const { id } = params;
    const blog = await getBlogById(id);
    if (!blog) {
        return null;
    }
    return <BlogId content={blog.content} />
}

export default Page;