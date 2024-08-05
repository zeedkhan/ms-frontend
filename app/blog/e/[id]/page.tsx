import CreateBlog from "@/components/blog/create-blog";
import { getBlogById } from "@/db/blog";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Edit Blog",
};

const Page = async ({ params }: { params: any }) => {
    const { id } = params;
    const blog = await getBlogById(id);
    if (!blog) {
        return null;
    }
    return <CreateBlog blog={blog} blogId={id} />;
}

export default Page;