import ItemInfo from "@/components/storage/item-info";
import { ReactNode } from "react";

const StorageLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="flex space-x-4">
            <div className="flex-1">
                {children}
            </div>

            <ItemInfo />

        </div>
    )
};

export default StorageLayout;