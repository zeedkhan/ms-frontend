import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type ContentWrapper = {
    children?: ReactNode,
    className?: string
}

export default function ContentWrapper({ children, className }: ContentWrapper) {
    return (
        <Card
            style={{ minHeight: "180px" }}
            className="rounded-lg border-none">
            <CardContent className={cn("p-6", className)}>
                <div className="flex justify-center items-center h-full">
                    {children || "Place Holder"}
                </div>
            </CardContent>
        </Card>
    );
}