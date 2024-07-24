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
                    Hello World{" "}
                    <Link
                        href="https://github.com/zeedkhan/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium underline underline-offset-4"
                    >
                        Tanakit Patan
                    </Link>
                </p>
            </div>
        </div>
    );
}