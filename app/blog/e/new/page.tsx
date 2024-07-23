import { auth } from "@/auth";
import CreateBlog from "@/components/blog/create-blog";
import { initialData } from "@/components/editor/data";

const Page = async () => {
    const session = await auth();
    if (!session || !session?.user) {
        return null
    }
    return <CreateBlog blog={{ ...initialData, userId: session.user.id, version: 1 }} blogId={null} />;
}

export default Page;