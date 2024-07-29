"use client";

import { Navbar } from "@/components/nav/navbar";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface ContentLayoutProps {
    title: string;
    children: React.ReactNode;
}

export function ContentLayout({ title, children }: ContentLayoutProps) {
    const pathname = usePathname();
    const [applyStyles, setApplyStyles] = useState<boolean>(true);

    const [pages, setPages] = useState(["chat", "file", "storage"]);

    useEffect(() => {
        const splitPath = pathname.split("/");
        if (splitPath[1] && pages.includes(splitPath[1])) {
            setApplyStyles(false);
        } else {
            setApplyStyles(true);
        }
    }, [pathname])

    return (
        <>
            <Navbar title="Test" />
            <div
                className={cn(
                    `${applyStyles ? "container pt-8 pb-8 px-4 sm:px-8 h-full" : ""}`
                )}
            >
                {children}
            </div>
        </>
    );
}