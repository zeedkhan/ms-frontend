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
    MessageSquareText,
    ImageMinus,
    ShipWheel
} from "lucide-react";

type Submenu = {
    href: string;
    label: string;
    active: boolean;
};

export type Menu = {
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
            groupLabel: "Dashboard",
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
                    label: "Blog",
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
                },
                {
                    href: "/crawler",
                    label: "Crawler",
                    active: pathname.includes("/crawler"),
                    icon: ShipWheel,
                    submenus: [] 
                },
                {
                    href: "/background-removal",
                    label: "Remove Background",
                    active: pathname.includes("/background-removal"),
                    icon: ImageMinus,
                    submenus: []
                },
            ]
        },
        {
            groupLabel: "Settings",
            menus: [
                {
                    href: "/setting",
                    label: "Account",
                    active: pathname.includes("/setting"),
                    icon: Settings,
                    submenus: []
                },
            ]
        }
    ];
}