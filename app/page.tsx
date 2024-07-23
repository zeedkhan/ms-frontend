import { auth } from "@/auth";
import { Card } from "@/components/ui/card";
import { redirect } from "next/navigation";

async function Page() {
    const session = await auth();
    
    if (!session) {
        return redirect("/auth/login");
    }

    return <Card>Authorized</Card>
}


export default Page;