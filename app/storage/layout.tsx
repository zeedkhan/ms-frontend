import ItemInfo from "@/components/storage/item-info";
import { ReactNode } from "react";

const StorageLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div>
            <div className="flex-1">
                {children}
            </div>

            <ItemInfo />

        </div>
    )
};

export default StorageLayout;