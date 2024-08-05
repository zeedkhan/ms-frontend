import { auth } from "@/auth";
import StorageItems from "@/components/storage/storage-items";
import { getUserStorge } from "@/db/user";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Storage",
};

export default async function StoragePage() {

    const session = await auth();

    if (!session?.user) {
        return null;
    }

    const files = await getUserStorge(session.user.id);

    return <StorageItems items={files || []} />
}