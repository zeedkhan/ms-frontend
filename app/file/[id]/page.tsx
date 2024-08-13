import { auth } from "@/auth";
import HTML from "@/components/files/html-viewer";
import Pdf from "@/components/files/pdf";
import { getFileId } from "@/db/user";
import { isHTML, isPDF } from "@/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "File",
};


export default async function FilePage(
    { params, searchParams }: { params: { id: string }; searchParams: URLSearchParams },
) {
    const session = await auth();

    const findFile = async (id: string, userId: string) => {
        return await getFileId(id, userId);
    }

    if (!session?.user) {
        return;
    };

    const file = await findFile(params.id, session?.user.id);

    if (file.error) {
        return (
            <div>
                {file.error}
            </div>
        )
    };


    if (file.successs && isHTML(file.successs.url)) {
        return <HTML file={file.successs} />
    }


    if (file.successs && isPDF(file.successs.url)) {
        return <Pdf url={file.successs.url} />
    }

    return (
        <div>
            <p>Something might went wrong!</p>
        </div>
    )
}