"use client";

import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { cn } from "@/lib/utils";
import { useStore } from "zustand";
import { Sidebar } from "../sidebar/sidebar";
import { useSession } from "next-auth/react";

export default function AdminPanelLayout({
    children
}: {
    children: React.ReactNode;
}) {
    const sidebar = useStore(useSidebarToggle, (state) => state);
    const session = useSession();

    if (!sidebar) return null;
    const shouldShow = !session.data ? "ml-0" : (sidebar?.isOpen === false) ? "lg:ml-[90px]" : "lg:ml-72";

    return (
        <>
            {session.data && <Sidebar />}
            <main
                className={cn(
                    "min-h-fit h-full",
                    " bg-zinc-50 dark:bg-zinc-900 transition-[margin-left] ease-in-out duration-300 pb-16",
                    shouldShow
                )}
            >
                {children}
            </main>
        </>
    );
}