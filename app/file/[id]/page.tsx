import { auth } from "@/auth";
import Pdf from "@/components/files/pdf";
import { getFileId } from "@/db/user";
import { isPDF } from "@/lib/utils";
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


    if (file.successs && isPDF(file.successs.url)) {
        return <Pdf url={file.successs.url} />
    }

    return (
        <div>
            <p>Something might went wrong!</p>
        </div>
    )
}