import { ContentLayout } from "@/components/layout/content-layout";
import AdminPanelLayout from "@/components/layout/layout-wrapper";
import { ReactNode } from "react";

export default function MicLayout({ children }: { children: ReactNode }) {
    return (
        <AdminPanelLayout>
            <ContentLayout>
                {children}
            </ContentLayout>
        </AdminPanelLayout>
    )
};