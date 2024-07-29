import {
    Tag,
    Users,
    Settings,
    Bookmark,
    SquarePen,
    LayoutGrid,
    LucideIcon,
    StickyNote,
    DatabaseZap,
    MessageSquareText
} from "lucide-react";

type Submenu = {
    href: string;
    label: string;
    active: boolean;
};

type Menu = {
    href: string;
    label: string;
    active: boolean;
    icon: LucideIcon
    submenus: Submenu[];
};

type Group = {
    groupLabel: string;
    menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
    return [
        {
            groupLabel: "",
            menus: [
                {
                    href: "/dashboard",
                    label: "Dashboard",
                    active: pathname.includes("/dashboard"),
                    icon: LayoutGrid,
                    submenus: []
                }
            ]
        },
        {
            groupLabel: "Services",
            menus: [
                {
                    href: "/chat",
                    label: "Chat",
                    active: pathname.includes("/chat"),
                    icon: MessageSquareText,
                    submenus: []
                },
                {
                    href: "/blog/e",
                    label: "blog",
                    active: pathname.includes("/blog"),
                    icon: StickyNote,
                    submenus: []
                },
                {
                    href: "/storage",
                    label: "Storage",
                    active: pathname.includes("/storage"),
                    icon: DatabaseZap,
                    submenus: []
                }
            ]
        },
        {
            groupLabel: "Settings",
            menus: [
                {
                    href: "/account",
                    label: "Account",
                    active: pathname.includes("/account"),
                    icon: Settings,
                    submenus: []
                }
            ]
        }
    ];
}