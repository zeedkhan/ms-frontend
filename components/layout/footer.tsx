import UseWindowSize from "@/hooks/use-window-size";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function Footer({ shouldShow }: { shouldShow: string }) {
    const { isMobile } = UseWindowSize();

    return (
        <footer
            className={cn(
                "transition-[margin-left] ease-in-out duration-300",
                shouldShow,
                isMobile && "hidden"
            )}
        >
            <div className={cn(
                "w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60",
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
        </footer>
    );
}

