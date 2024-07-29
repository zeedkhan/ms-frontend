"use client";

import { ReactNode } from "react";
import { SheetMenu } from "./sheet-menu";
import { UserNav } from "./user-nav";
import { ModeToggle } from "./mode-toggle";
import SocketIndecator from "./socket-indicator";
import { useSession } from "next-auth/react";

interface NavbarProps {
    title: ReactNode;
}

export function Navbar({ title }: NavbarProps) {
    const session = useSession();
    return (
        <header className="sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
            <div className="mx-4 sm:mx-8 flex h-14 items-center">
                <div className="flex items-center space-x-4 lg:space-x-0">
                    <SheetMenu />
                    <h1 className="font-bold"></h1>
                </div>
                <div className="flex flex-1 items-center space-x-2 justify-end">
                    <SocketIndecator />
                    {session.data && (
                        <UserNav session={session.data} />
                    )}
                    <ModeToggle />
                </div>
            </div>
        </header>
    );
}