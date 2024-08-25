import { auth } from "@/auth";
import Storage from "@/components/storage/storage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Storage",
};

export default async function StoragePage() {

    const session = await auth();

    if (!session?.user) {
        return null;
    };

    return <Storage />
}