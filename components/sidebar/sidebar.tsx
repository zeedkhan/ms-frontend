import Link from "next/link";
import { PanelsTopLeft, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { useStore } from "zustand";
import { SidebarToggle } from "./sidebar-toggle";
import { Menu } from "./menu";
import { Command, CommandInput, CommandItem, CommandList } from "../ui/command";
import { Separator } from "../ui/separator";

export function Sidebar() {
    const sidebar = useStore(useSidebarToggle, (state) => state);
    if (!sidebar) return null;
    return (
        <aside
            className={cn(
                "rounded-xl shadow-xl",
                "fixed top-0 left-0 z-50 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300",
                sidebar?.isOpen === false ? "w-[90px]" : "w-72"
            )}
        >
            <SidebarToggle isOpen={sidebar?.isOpen} setIsOpen={sidebar?.setIsOpen} />
            <div className="h-full flex flex-col space-y-4 shadow-md dark:shadow-zinc-800">
                <div className="w-full h-[56px]">
                    <Button
                        className={cn(
                            "w-full h-full transition-transform ease-in-out duration-300",
                            sidebar?.isOpen === false ? "translate-x-1" : "translate-x-0"
                        )}
                        variant="link"
                        asChild
                    >
                        <Link href="/dashboard" className=" flex items-center gap-2">
                            <PanelsTopLeft className="w-6 h-6 mr-1" />
                            <h1
                                className={cn(
                                    "font-bold text-lg whitespace-nowrap transition-[transform,opacity,display] ease-in-out duration-300",
                                    sidebar?.isOpen === false
                                        ? "-translate-x-96 opacity-0 hidden"
                                        : "translate-x-0 opacity-100"
                                )}
                            >
                                Brand
                            </h1>
                        </Link>
                    </Button>
                    {/* <Separator className="mt-1" /> */}
                </div>
                <div className="h-full  overflow-y-auto">
                    <Menu isOpen={sidebar?.isOpen} />
                </div>


            </div>
        </aside>
    );
}