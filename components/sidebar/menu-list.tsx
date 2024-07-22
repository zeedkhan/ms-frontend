import {
    Tag,
    Users,
    Settings,
    Bookmark,
    SquarePen,
    LayoutGrid,
    LucideIcon,
    StickyNote
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
            groupLabel: "Contents",
            menus: [
                {
                    href: "/categories",
                    label: "Categories",
                    active: pathname.includes("/categories"),
                    icon: Bookmark,
                    submenus: []
                },
                {
                    href: "/tags",
                    label: "Tags",
                    active: pathname.includes("/tags"),
                    icon: Tag,
                    submenus: []
                }
            ]
        },
        {
            groupLabel: "Blog",
            menus: [
                {
                    href: "/blog/e",
                    label: "blog",
                    active: pathname.includes("/blog"),
                    icon: StickyNote,
                    submenus: []
                },
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