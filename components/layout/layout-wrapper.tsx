"use client";

import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { cn } from "@/lib/utils";
import { useStore } from "zustand";
import { Footer } from "./footer";
import { Sidebar } from "../sidebar/sidebar";
import { useSession } from "next-auth/react";
import { UIEvent, useState } from "react";
import HoverPlayer from "../hover-player";

export default function AdminPanelLayout({
    children
}: {
    children: React.ReactNode;
}) {
    const sidebar = useStore(useSidebarToggle, (state) => state);
    const session = useSession();
    const [scrollTop, setScrollTop] = useState(0);

    if (!sidebar) return null;
    const shouldShow = !session.data ? "ml-0" : (sidebar?.isOpen === false) ? "lg:ml-[90px]" : "lg:ml-72";

    
    const handleScroll = (e: UIEvent<HTMLElement, globalThis.UIEvent>) => {
        setScrollTop(e.currentTarget.scrollTop);
    }

    return (
        <>
            {session.data && <Sidebar />}
            <main
                onScroll={handleScroll}
                className={cn(
                    "overflow-hidden overflow-y-auto",
                    "min-h-[calc(100vh_-_56px)] bg-zinc-50 dark:bg-zinc-900 transition-[margin-left] ease-in-out duration-300",
                    shouldShow
                )}
            >
                <HoverPlayer scrollTop={scrollTop}/>
                {children}
            </main>
            <footer
                className={cn(
                    "transition-[margin-left] ease-in-out duration-300",
                    shouldShow
                )}
            >
                <Footer />
            </footer>
        </>
    );
}