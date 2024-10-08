"use client";

import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import UseWindowSize from "@/hooks/use-window-size";
import { cn } from "@/lib/utils";
import { publicRoutes } from "@/routes";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "zustand";

export function Footer() {
    const session = useSession();
    const sidebar = useStore(useSidebarToggle, (state) => state);
    const pathname = usePathname();
    const { isMobile } = UseWindowSize();

    const shouldShow = (publicRoutes.includes(pathname) || !session.data) ? "ml-0" : (sidebar?.isOpen === false) ? "lg:ml-[90px]" : "lg:ml-72";
    const padLeft = (publicRoutes.includes(pathname) || !session.data) ? "pr-0" : (sidebar?.isOpen === false) ? "lg:pr-[90px]" : "lg:pr-72";

    if (isMobile || pathname.includes("/chat")) {
        return null;
    }

    return (
        <footer
            className={cn(
                "fixed bottom-0 w-full  z-50",
                "transition-[margin-left] ease-in-out duration-300",
                shouldShow,
            )}
        >
            <div className={cn(
                "w-full shadow backdrop-blur supports-[backdrop-filter]:bg-background/60",
            )}>
                <div className="mx-4 md:mx-8 flex h-14 items-center justify-evenly">
                    <p className={cn(
                        padLeft,
                        "text-xs md:text-sm leading-loose text-muted-foreground text-left"
                    )}
                    >
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
        </footer>
    );
}

