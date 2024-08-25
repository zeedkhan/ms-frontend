"use client";

import CustomBreadCrumb from "@/components/custom-bread-crumb";
import { ReactNode } from "react";
import NavigateOptions from "./account/_components/options";
import ContentWrapper from "./account/_components/content-wrapper";
import { Separator } from "@radix-ui/react-dropdown-menu";

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
        <div>
            <CustomBreadCrumb routes={routes} />
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 w-full space-x-0 min-h-[180px]">
                <NavigateOptions />
                <div className="flex-1">
                    <ContentWrapper>
                        <div className="w-full h-full">
                            <h2 className="text-2xl font-semibold">Settings</h2>
                            <p className="text-gray-500">Manage your account settings and set e-mail preferences.</p>
                            <Separator
                                className="my-4 "
                            />

                            {children}
                        </div>
                    </ContentWrapper>
                </div>
            </div>
        </div>
    )
}