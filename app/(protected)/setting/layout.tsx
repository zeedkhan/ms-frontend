"use client";

import CustomBreadCrumb from "@/components/custom-bread-crumb";
import { ReactNode } from "react";
import NavigateOptions from "./account/_components/options";
import ContentWrapper from "./account/_components/content-wrapper";
import { Separator } from "@radix-ui/react-dropdown-menu";
import AdminPanelLayout from "@/components/layout/layout-wrapper";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const title = "Settings";

const routes = [{
    title: "Home",
    url: "/"
}, {
    title: title,
    url: `/${title}`
}];

export default function SettingLayout({ children }: { children: ReactNode }) {
    return (
        <AdminPanelLayout>
            <div className="p-4">
                <CustomBreadCrumb routes={routes} />
            </div>
            <div className={
                cn(
                    `w-full h-[calc(100vh - 172px)] min-h-[180px]`,
                    `flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 space-x-0`
                )
            }>
                <ScrollArea
                    className="h-fit md:h-[calc(100vh_-_172px)] shadow md:max-w-lg"
                >
                    <NavigateOptions />
                </ScrollArea>

                <ScrollArea
                    className="h-fit md:h-[calc(100vh_-_172px)]  shadow flex-1 md:max-w-lg w-full"
                >
                    <ContentWrapper className="h-full p-4">
                        <div className="w-full h-full  ">
                            <h2 className="text-2xl font-semibold">Settings</h2>
                            <p className="text-gray-500">Manage your account settings and set e-mail preferences.</p>
                            <Separator
                                className="my-4 "
                            />

                            {children}
                        </div>
                    </ContentWrapper>
                </ScrollArea>
            </div>
        </AdminPanelLayout>
    )
}