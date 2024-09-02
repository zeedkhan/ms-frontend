"use client";

import { SheetMenu } from "./sheet-menu";
import { UserNav } from "./user-nav";
import { ModeToggle } from "./mode-toggle";
import SocketIndecator from "./socket-indicator";
import { useSession } from "next-auth/react";
import { useStore } from "zustand";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { cn } from "@/lib/utils";
import { publicRoutes } from "@/routes";
import { usePathname } from "next/navigation";
import { useMotionValueEvent, useScroll } from "framer-motion"
import { useEffect, useMemo, useState } from "react";
import UseWindowSize from "@/hooks/use-window-size";
import { motion } from "framer-motion";


export function Navbar() {
    const session = useSession();
    const sidebar = useStore(useSidebarToggle, (state) => state);
    const pathname = usePathname();
    const [float, setFloat] = useState(false);
    const { isMobile, isTablet } = UseWindowSize();

    useEffect(() => {
        if (isMobile && sidebar.isOpen) {
            sidebar.setIsOpen();
        };

    }, [isMobile]);

    const { scrollY } = useScroll();


    useMotionValueEvent(scrollY, "change", (latest) => {
        if (latest > 100) {
            setFloat(true);
        } else {
            setFloat(false);
        }
    })


    const width = useMemo(() => {
        if (!float && !isMobile && publicRoutes.includes(pathname)) {
            return "100%"
        }
        if (isMobile && float) {
            return "calc(100% - 32px)"
        } else if (!isMobile && !float && !sidebar.isOpen && !isTablet) {
            return `calc(100% - 90px)`
        } else if (sidebar.isOpen && !isMobile && !float) {
            return "calc(100% - 288px)"
        } else if (!isMobile && float) {
            return "32rem"
        }
        return "100%"
    }, [isMobile, sidebar.isOpen, float, pathname, isTablet])

    return (

        <motion.header
            initial={{ width: "100%" }}
            animate={{
                top: float ? "10px" : "0",
                x: (sidebar.isOpen && float && !isMobile && session.data?.user) ? "90px" : "0",
                width: width,
                marginLeft: "auto",
                marginRight: float ? "auto" : "0",
            }}
            transition={{ duration: 0.3 }}
            className={cn(
                `bg-background/95 shadow backdrop-blur sticky h-[56px]`,
                `supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary`,
                `${float ? "rounded-full shadow border z-[999]" : "z-50"}`,
            )}

        >
            <div className={cn(
                "mx-4 sm:mx-8 flex h-14 items-center",
            )}>
                <div className="flex items-center space-x-4">
                    <SheetMenu />
                    {/* <h1 className="font-bold">Test</h1> */}
                </div>


                <div className="flex flex-1 items-center space-x-2 justify-end">
                    <SocketIndecator />
                    {session.data && (
                        <UserNav session={session.data} />
                    )}
                    <ModeToggle />
                </div>
            </div>
        </motion.header >
    );
}