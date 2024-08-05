import { auth } from "@/auth";
import { getUserBlogs } from "@/db/blog";
import Landing from "./_component/landing";
import { Metadata } from 'next'


export const metadata: Metadata = {
    title: "Blogs",
};


const Page = async () => {
    const session = await auth();

    if (!session) {
        return null
    }

    const getData = await getUserBlogs(session.user.id);

    return (
        <Landing blogs={getData} />
    );
}

export default Page
