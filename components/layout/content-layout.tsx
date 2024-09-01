import { cn } from "@/lib/utils";

interface ContentLayoutProps {
    children: React.ReactNode;
}

export function ContentLayout({ children }: ContentLayoutProps) {
    return (
        <div
            className={cn(
                `pt-8 pb-8 px-4 sm:px-8 h-full`
            )}
        >
            {children}
        </div>
    );
}