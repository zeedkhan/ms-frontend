"use client";

import { useEffect, useState } from "react";
import { EnhanceButton } from "@/components/ui/enhance-button";
import Crawler from "./crawler";
import Records from "./records";
import { cn } from "@/lib/utils";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "@/components/loader/use-router";


const knowCMS = [
    {
        name: "WordPress",
        googletagmager: true,
        googleanalytics: true,
    },
    {
        name: "makewebeasy",
        googletagmager: true,
        googleanalytics: true,
    },
    {
        name: "shopify",
        googletagmager: true,
        googleanalytics: true,
    },
    {
        name: "wix",
        googletagmager: true,
        googleanalytics: true,
    },
    {
        name: "simdiff",
        googletagmager: false,
        googleanalytics: true,
    },
    {
        name: "readyplanet",
        googletagmager: true,
        googleanalytics: true,
    },
    {
        name: "tarad",
        googletagmager: true,
        googleanalytics: true,
    },
    {
        name: "joomla",
        googletagmager: true,
        googleanalytics: true
    },
    {
        name: "magento",
        googletagmager: true,
        googleanalytics: true
    },
    {
        name: "opencart",
        googletagmager: true,
        googleanalytics: true
    },
    {
        name: "weebly",
        googletagmager: true,
        googleanalytics: true
    },
    {
        name: "googlesites",
        googletagmaer: false,
        googleanalytics: true
    },
    {
        name: "lnwshop",
        googletagmager: true,
        googleanalytics: true
    },
    {
        name: "salepage",
        googletagmager: true,
        googleanalytics: true
    },
    {
        name: "itopplus",
        googletagmager: true,
        googleanalytics: true
    },
    {
        name: "blogspot",
        googletagmager: true,
        googleanalytics: true
    },
    {
        name: "godaddy",
        googletagmager: false,
        googleanalytics: true
    },
    {
        name: "fastcommerz",
        googletagmager: true,
        googleanalytics: true
    },
    {
        name: "fastpage",
        googletagmager: true,
        googleanalytics: true
    },
    {
        name: "yellowpages",
        googletagmager: false,
        googleanalytics: true
    },
    {
        name: "makewebready",
        googletagmager: false,
        googleanalytics: false
    }
]


export default function Content() {
    const [select, setSelect] = useState<number>(0);
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (searchParams.get("view") === "records") {
            setSelect(1);
        };
        if (searchParams.get("view") === "crawl") {
            setSelect(0);
        };
    }, [searchParams]);

    const handleClick = (type: number) => {
        if (type === 0) {
            router.push(pathname + "?view=crawl");
        }
        if (type === 1) {
            router.push(pathname + "?view=records");
        }
    }

    return (
        <div className="h-full max-h-[calc(100vh-176px)] p-4 pb-48">
            <div className="py-2 flex items-center space-x-4 px-4 pb-8">
                <EnhanceButton
                    onClick={() => handleClick(0)}
                    variant={"outline"}
                    className={cn(
                        `min-w-20 h-8 rounded-full`,
                        select === 0 && "bg-gray-200 dark:text-black"
                    )}
                >
                    Crawl
                </EnhanceButton>
                <EnhanceButton
                    onClick={() => handleClick(1)}
                    variant={"outline"}
                    className={cn(
                        `min-w-20 h-8 rounded-full`,
                        select === 1 && "bg-gray-200 dark:text-black"
                    )}
                >
                    Records
                </EnhanceButton>
            </div>


            {select === 0 && (
                <Crawler />
            )}

            {select === 1 && (
                <Records />
            )}




        </div>
    )
}