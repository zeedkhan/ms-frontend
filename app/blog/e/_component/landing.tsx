import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Blog } from "@/types";
import { FilePlus2, StickyNote } from "lucide-react";
import Link from "next/link";

function Landing({ blogs }: { blogs: Blog[] }) {

    return (
        <>
            <div className="grid gird-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-8 gap-3">
                <Link href={"/blog/e/new"}>
                    <Card className="flex flex-col space-y-2 pt-2">
                        <div className="flex items-center flex-col">
                            <FilePlus2  size={36} />
                            <Separator className="mt-2" />
                        </div>

                        <h2 className="text-sm font-bold pb-2 px-2">Create New Blog</h2>
                    </Card>
                </Link>

                {blogs.map((blog, key) => (
                    <Link key={key} href={`/blog/e/${blog.id}` as string}>
                        <Card className="flex flex-col space-y-2 pt-2">
                            <div className="flex items-center flex-col">
                                <StickyNote size={36} />
                                <Separator className="mt-2" />
                            </div>
                            <h2 className="text-sm font-bold pb-2 px-2">{blog.title}</h2>
                        </Card>
                    </Link>
                ))}
            </div>

        </>

    )
}

export default Landing;