import { ContentLayout } from "@/components/layout/content-layout";
import AdminPanelLayout from "@/components/layout/layout-wrapper";
import ItemInfo from "@/components/storage/item-info";
import { ReactNode } from "react";

const StorageLayout = ({ children }: { children: ReactNode }) => {
    return (
        <AdminPanelLayout>
            <ContentLayout>
                <div>
                    <div className="flex-1">
                        {children}
                    </div>
                    <ItemInfo />
                </div>
            </ContentLayout>
        </AdminPanelLayout>
    )
};

export default StorageLayout;