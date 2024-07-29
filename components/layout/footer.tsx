import { cn } from "@/lib/utils";
import Link from "next/link";

export function Footer() {
    return (
        <div className={cn(
            "hidden md:block",
            "w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60",
            // `${isFixed && "fixed bottom-0"}`
        )}>
            <div className="mx-4 md:mx-8 flex h-14 items-center justify-evenly">
                <p className="text-xs md:text-sm leading-loose text-muted-foreground text-left">
                    Hello World{" "}
                    <Link
                        href="https://github.com/zeedkhan/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium underline underline-offset-4"
                    >
                        Tanakit Patan
                    </Link>
                </p>
            </div>
        </div>
    );
}