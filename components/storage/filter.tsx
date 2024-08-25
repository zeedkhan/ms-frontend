import { BookA, Calendar, ChevronDown, Clapperboard, File, FileMusic, Folder, Image, LayoutGrid, List, TableOfContents } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useEffect, useState } from "react";
import { useRouter } from "../loader/use-router";
import { cn } from "@/lib/utils";
import { usePathname, useSearchParams } from 'next/navigation'
import StorageStore from "@/state/storage";
import SelectItemsOptions from "./select-items-options";

const ModifyAt: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const [selectedIdx, setSelectedIdx] = useState<number>(-1);
    const options = [
        {
            key: "Today", value: 0,
        },
        {
            key: "Yesterday", value: 1,
        },
        {
            key: "This week", value: 7,
        },
        {
            key: "This month", value: 30,
        },
        {
            key: "This year", value: 365,
        }
    ];

    useEffect(() => {
        if (searchParams.get("after")) {
            const afterDateStr = searchParams.get("after")!;
            const afterDate = new Date(afterDateStr);
            const today = new Date();

            // Calculate the difference in days
            const diffInTime = today.getTime() - afterDate.getTime();
            const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24));

            // Find the closest matching option based on the difference in days
            const closestOptionIdx = options.findIndex(option => option.value >= diffInDays);

            if (closestOptionIdx !== -1) {
                setSelectedIdx(closestOptionIdx);
            } else {
                setSelectedIdx(-1); // If no match found
            }
        }
    }, [searchParams]);

    const formatDate = (date: Date) => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }

    const getDaysAgo = (days: number) => {
        const date = new Date();
        date.setDate(date.getDate() - days);
        return date;
    }

    const handleSelect = (index: number) => {
        const params = new URLSearchParams(searchParams.toString());
        const ago = getDaysAgo(options[index].value);
        const format = formatDate(ago);
        const path = pathname.split("/").pop();

        if (selectedIdx === index) {
            setSelectedIdx(-1);
            params.delete("after");
            if (path === "storage") {
                router.push("/storage/search?" + params.toString());
            } else {
                router.push(pathname + "?" + params.toString());
            }
            return;
        }

        params.set("after", format);
        setSelectedIdx(index);
        if (path === "storage") {
            router.push("/storage/search?" + params.toString());
        } else {
            router.push(pathname + "?" + params.toString());
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Card
                    className={cn(
                        `min-w-32 rounded-full h-full cursor-pointer my-8 active:scale-95`,
                        selectedIdx >= 0 ? "bg-sky-200 dark:text-black" : " "
                    )}>
                    <CardContent className="p-0 py-2 px-4 h-full w-full flex items-center justify-between text-sm">
                        <Calendar size={18} />
                        <p className="px-4">{selectedIdx >= 0 ? options[selectedIdx].key : "Modified"}</p>
                        <ChevronDown size={18} />
                    </CardContent>
                </Card>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {options.map((item, index) => (
                    <DropdownMenuItem
                        onClick={() => handleSelect(index)}
                        key={index} className="py-2 cursor-pointer">
                        <div className="flex items-center space-x-2">
                            <p>{item.key}</p>
                        </div>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

const TypeFiles: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const [selectedIdx, setSelectedIdx] = useState<number>(-1);
    const { filterFilesType, removeFilesType } = StorageStore();
    const permanentFiles = StorageStore((state) => state.permanentFiles);

    const options = [
        {
            key: "PDFs", icon: BookA, value: "pdf",
        },
        {
            key: "Photos & images", icon: Image, value: "image",
        },
        {
            key: "Audio", icon: FileMusic, value: "audio",
        },
        {
            key: "Folders", icon: Folder, value: "directory",
        },
        {
            key: "Videos", icon: Clapperboard, value: "video",
        }
    ];

    useEffect(() => {
        const path = pathname.split("/").pop();
        if (searchParams.get("type")) {
            const type = searchParams.get("type");
            const idx = options.findIndex(option => option.value === type);
            setSelectedIdx(idx);
            if (path !== "/storage") {
                filterFilesType(options[idx].value);
            }
        } else {
            setSelectedIdx(-1);
            removeFilesType();
        }
    }, [searchParams, permanentFiles]);



    const handleSelect = (index: number) => {
        const path = pathname.split("/").pop();
        const params = new URLSearchParams(searchParams.toString());
        if (selectedIdx === index) {
            setSelectedIdx(-1);
            params.delete("type");
            if (path === "/storage") {
                router.push("/storage/search?" + params.toString());
            } else {
                router.push(pathname + "?" + params.toString());
            }
            return;
        }

        params.set("type", options[index].value);
        setSelectedIdx(index);
        if (path === "/storage") {
            router.push("/storage/search?" + params.toString());
        } else {
            router.push(pathname + "?" + params.toString());
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Card
                    className={cn(
                        "dark:text-white text-black min-w-32 rounded-full h-full cursor-pointer my-8 active:scale-95 ",
                        selectedIdx >= 0 ? "bg-sky-200 dark:text-black" : " "
                    )}
                >
                    <CardContent className="p-0 py-2 px-4 h-full w-full flex items-center justify-between text-sm">
                        <File size={18} />
                        <p className="px-4">{selectedIdx >= 0 ? options[selectedIdx].key : "Type"}</p>
                        <ChevronDown size={18} />
                    </CardContent>
                </Card>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {options.map((item, index) => (
                    <DropdownMenuItem
                        onClick={() => handleSelect(index)}
                        key={index}
                        className="py-2 cursor-pointer">
                        <div className="flex items-center space-x-2">
                            <item.icon size={18} />
                            <p>{item.key}</p>
                        </div>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
};


const ViewOptions: React.FC = () => {
    const searchParams = useSearchParams();
    const [selectedIdx, setSelectedIdx] = useState<number>(-1);
    const router = useRouter();
    const pathname = usePathname();

    const options = [
        {
            key: "Grid", icon: LayoutGrid, value: "grid",
        },
        {
            key: "List", icon: TableOfContents, value: "list",
        },
    ];

    const handleSelect = (index: number) => {
        const params = new URLSearchParams(searchParams.toString());
        if (selectedIdx === index) {
            setSelectedIdx(-1);
            params.delete("view");
            router.push(pathname + "?" + params.toString());
            return;
        }
        params.set("view", options[index].value);
        setSelectedIdx(index);
        router.push(pathname + "?" + params.toString());
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Card className="min-w-32 rounded-full h-full cursor-pointer my-8 active:scale-95">
                    <CardContent className="p-0 py-2 px-4 h-full w-full flex items-center justify-between text-sm">
                        {selectedIdx <= 0 ? <LayoutGrid size={18} /> : <List size={18} />}
                        <p className="px-4">{selectedIdx >= 0 ? options[selectedIdx].key : "Grid"}</p>
                        <ChevronDown size={18} />
                    </CardContent>
                </Card>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {options.map((item, index) => (
                    <DropdownMenuItem
                        onClick={() => handleSelect(index)}
                        key={index}
                        className="py-2 cursor-pointer">
                        <div className="flex items-center space-x-2">
                            <item.icon size={18} />
                            <p>{item.key}</p>
                        </div>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

const Filter: React.FC = () => {
    return (
        <div className="flex items-center justify-center space-x-4">
            <SelectItemsOptions />
            <TypeFiles />
            <ModifyAt />
            <ViewOptions />
        </div>
    )
}


export default Filter;