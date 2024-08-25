'use client';

import { cn, openFileStorage } from "@/lib/utils"
import { CardContent } from "../ui/card"
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { UPLOAD_ROUTES } from "@/routes";
import StorageStore from "@/state/storage";
import { useRouter } from "../loader/use-router";
import { usePathname, useSearchParams } from 'next/navigation';
import { Command, CommandInput, CommandItem, CommandList, } from "@/components/ui/command"
import { useDebounce } from 'use-debounce';
import { QueryClientProvider, QueryClient, useQuery } from '@tanstack/react-query';
import Extension from "./extension";
import { SearchResult } from "@/types";

const queryClient = new QueryClient();

interface SearchResultsProps {
    query: string;
};

const serchItem = async (input: string): Promise<SearchResult[]> => {
    if (!input) return [];
    try {
        const request = await axios.get<{ data: SearchResult[] }>(`${UPLOAD_ROUTES.searchDirectoryAndStorage}/${input}`);
        return request.data.data || [];
    } catch (error) {
        console.error("Error searching:", error);
        return []
    }
}

function SearchResults({
    query,
}: SearchResultsProps) {
    const [debouncedSearchQuery] = useDebounce(query, 500);
    const router = useRouter();
    const enabled = !!debouncedSearchQuery;
    const {
        data,
        isLoading: isLoadingOrig,
        isError,
    } = useQuery<SearchResult[]>({
        queryKey: ['search', debouncedSearchQuery],
        queryFn: () => serchItem(debouncedSearchQuery),
        enabled,
    });

    // remove duplicate
    const handleSelect = (item: SearchResult) => {
        if (item.url) {
            const url = openFileStorage(item.id);
            if (url) {
                window.open(url, "_blank");
            }
        } else {
            console.log("Should open directory", item.id);
            router.push("/storage/" + item.id);
        }
    }

    return (
        <CommandList
            hidden={!query}
        >
            {!isError && !isLoadingOrig && !data?.length && (
                <div className="p-4 text-sm">Searching...</div>
            )}
            {isError && <div className="p-4 text-sm">Something went wrong</div>}

            {data?.map((item) => {
                return (
                    <CommandItem
                        key={item.id}
                        onSelect={() => handleSelect(item)}
                        value={item.id}
                    >
                        <div className="flex items-center justify-center space-x-4">
                            <Extension file={item}/>
                            <p>{item.name} <span hidden>{item.id}</span></p>
                        </div>
                    </CommandItem>
                );
            })}
        </CommandList>
    );
}

const Search = () => {
    const [isFocus, setIsFocus] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const directoryName = StorageStore((state) => state.name);
    const searchParams = useSearchParams();
    const [input, setInput] = useState(searchParams.get("q") || "");
    const pathname = usePathname();

    useEffect(() => {
        const handleEnter = (e: KeyboardEvent) => {
            if (input === searchParams.get("q")) return;
            const path = pathname.split("/").pop();
            if (e.key === "Enter" && isFocus) {
                const params = new URLSearchParams(searchParams.toString());
                params.set("q", input);
                if (input === "") {
                    params.delete("q");
                }
                if (path === "storage") {
                    router.push("/storage/search?" + params.toString());
                } else {
                    router.push(pathname + "?" + params.toString());
                }
            }
        };
        window.addEventListener("keydown", handleEnter);
        return () => {
            window.removeEventListener("keydown", handleEnter);
        }
    }, [isFocus, input]);

    return (
        <>
            <CardContent
                ref={containerRef}
                className={cn(
                    `pb-0 relative max-w-4xl mx-auto text-center flex flex-col `,
                )}
            >
                {directoryName && <h2 className="text-center text-2xl py-6">{directoryName}</h2>}

                <QueryClientProvider
                    client={queryClient}
                >
                    <Command
                        shouldFilter={false}
                        className={cn("border")}
                    >
                        <CommandInput
                            onFocus={() => setIsFocus(true)}
                            onBlur={() => setIsFocus(false)}
                            value={input}
                            onValueChange={(value) => setInput(value)}
                        />

                        <SearchResults
                            query={input}
                        />
                    </Command>

                </QueryClientProvider>
            </CardContent >
        </>
    )
};

export default Search;