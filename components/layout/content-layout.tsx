import { Navbar } from "@/components/nav/navbar";

interface ContentLayoutProps {
    title: string;
    children: React.ReactNode;
}

export async function ContentLayout({ title, children }: ContentLayoutProps) {
    return (
        <>
            <Navbar title="Test" />
            <div className="container pt-8 pb-8 px-4 sm:px-8 min-h-[calc(100vh-112px)">{children}</div>
        </>
    );
}