"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";

export function Footer() {
    const [isFixed, setIsFixed] = useState(true);
    return (
        <div className={cn(
            "z-20  w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60",
            `${isFixed && "fixed"}`
        )}>
            <div className="mx-4 md:mx-8 flex h-14 items-center justify-evenly">
                <p className="text-xs md:text-sm leading-loose text-muted-foreground text-left">
                    Built on top of{" "}
                    <Link
                        href="https://ui.shadcn.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium underline underline-offset-4"
                    >
                        shadcn/ui
                    </Link>
                    . The source code is available on{" "}
                    <Link
                        href="https://github.com/salimi-my/shadcn-ui-sidebar"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium underline underline-offset-4"
                    >
                        GitHub
                    </Link>
                    .
                </p>
            </div>
        </div>
    );
}