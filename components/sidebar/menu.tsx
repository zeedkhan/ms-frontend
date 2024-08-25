"use client";

import Link from "next/link";
import { Ellipsis, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { logout } from "@/actions/logout";
import { getMenuList, Menu as MenuType } from "./menu-list";
import { CollapseMenuButton } from "./collapse-menu-button";
import { Command, CommandGroup, CommandItem, CommandList, CommandSeparator } from "../ui/command";

interface MenuProps {
    isOpen: boolean | undefined;
};

interface GroupItemProps extends MenuProps {
    groupLabel: string;
    menus: MenuType[];
};

const GroupItem = ({ isOpen, groupLabel, menus }: GroupItemProps) => {
    return (
        <CommandGroup
            className="p-0 "
            heading={isOpen ? (
                <div className="py-0.5 text-base text-center">
                    <p>{groupLabel}</p>
                </div>
            ) : (
                <Ellipsis className="mx-auto" size={18} />
            )}>
            <li className={cn("w-full", groupLabel ? "" : "")}>
                <CommandList>
                    {menus.map(
                        ({ href, label, icon: Icon, active, submenus }, index) =>
                            submenus.length === 0 ? (
                                <CommandItem key={index} className="p-0">
                                    <TooltipProvider
                                        disableHoverableContent
                                    >
                                        <Tooltip delayDuration={100}>
                                            <TooltipTrigger asChild className="w-full">
                                                <div className="w-full">
                                                    <Button
                                                        variant={active ? "secondary" : "ghost"}
                                                        className={cn(
                                                            "w-full",
                                                            `${isOpen === false ? "justify-center" : "justify-start"}`
                                                        )}
                                                        asChild
                                                    >
                                                        <Link href={href}
                                                            className={cn(
                                                                `flex  space-x-4`,
                                                                isOpen === false ? "items-center justify-center" : "items-start justify-start"
                                                            )}
                                                        >
                                                            <span>
                                                                <Icon size={18} />
                                                            </span>
                                                            {isOpen && (
                                                                <p
                                                                    className={cn(
                                                                        "truncate",
                                                                    )}
                                                                >
                                                                    {label}
                                                                </p>
                                                            )}
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </TooltipTrigger>
                                            {isOpen === false && (
                                                <TooltipContent side="right">
                                                    {label}
                                                </TooltipContent>
                                            )}
                                        </Tooltip>
                                    </TooltipProvider>
                                </CommandItem>
                            ) : (
                                <div className="w-full" key={index}>
                                    <CollapseMenuButton
                                        icon={Icon}
                                        label={label}
                                        active={active}
                                        submenus={submenus}
                                        isOpen={isOpen}
                                    />
                                </div>
                            )
                    )}
                </CommandList>
            </li>
            <CommandSeparator />
        </CommandGroup>
    )
};

export function Menu({ isOpen }: MenuProps) {
    const pathname = usePathname();
    const menuList = getMenuList(pathname);
    const allItemsNotLast = menuList.slice(0, menuList.length - 1);
    const lastItem = [menuList[menuList.length - 1]];
    return (
        <nav className="h-full w-full">
            <ul className="h-full w-full flex flex-col min-h-[calc(100vh-48px-36px-16px-32px)] lg:min-h-[calc(100vh-32px-40px-32px)] items-start space-y-1 ">
                <Command>
                    {allItemsNotLast.map(({ groupLabel, menus }, index) => (
                        <GroupItem
                            key={index}
                            groupLabel={groupLabel}
                            menus={menus}
                            isOpen={isOpen}
                        />
                    ))}
                    <div className="w-full grow flex flex-col justify-end">
                        {lastItem.map(({ groupLabel, menus }, index) => (
                            <GroupItem
                                key={index}
                                groupLabel={groupLabel}
                                menus={menus}
                                isOpen={isOpen}
                            />
                        ))}
                        <TooltipProvider disableHoverableContent>
                            <Tooltip delayDuration={100}>
                                <TooltipTrigger asChild>
                                    <Button
                                        onClick={() => logout()}
                                        variant="outline"
                                        className="w-full justify-center h-14"
                                    >
                                        <span className={cn(isOpen === false ? "" : "mr-4")}>
                                            <LogOut size={18} />
                                        </span>
                                        <p
                                            className={cn(
                                                "whitespace-nowrap",
                                                isOpen === false ? "opacity-0 hidden" : "opacity-100"
                                            )}
                                        >
                                            Sign out
                                        </p>
                                    </Button>
                                </TooltipTrigger>
                                {isOpen === false && (
                                    <TooltipContent side="right">Sign out</TooltipContent>
                                )}
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                </Command>
            </ul>
        </nav>
    );
}