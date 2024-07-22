import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

type ContentWrapper = {
    children?: ReactNode
}

export default function ContentWrapper({ children }: ContentWrapper) {
    return (
        <Card className="rounded-lg border-none mt-6">
            <CardContent className="p-6">
                <div className="flex justify-center items-center min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)]">
                    {children || "Place Holder"}
                </div>
            </CardContent>
        </Card>
    );
}