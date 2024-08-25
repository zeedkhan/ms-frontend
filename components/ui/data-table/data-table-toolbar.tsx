import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DataTableViewOptions } from "./data-table-view-options"
import { cn } from "@/lib/utils"
import { EnhanceButton } from "../enhance-button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "../dropdown-menu"
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { ChevronDown } from "lucide-react"

interface DataTableToolbarProps<TData> {
    table: Table<TData>
    children?: React.ReactNode
    deleteFn: (id: string) => Promise<void>
};

export function DataTableToolbar<TData>({
    table,
    children,
    deleteFn
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;
    const selectNum = Object.keys(table.getState().rowSelection).length;

    const dropdownOptions = [
        {
            key: "Remove",
            action: async () => {
                const allIds = Object.keys(table.getState().rowSelection).map((key) => {
                    const { original } = table.getRow(key);
                    // @ts-ignore;
                    return deleteFn(original.id);
                });
                if (allIds.length > 0) {
                    await Promise.all(allIds);
                    table.resetRowSelection();
                }
            }
        }
    ]

    return (
        <div className="flex items-center justify-between">
            {
                selectNum > 0 && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <EnhanceButton
                                variant={"outline"}
                                className="h-[32px] text-xs"
                                size={"sm"}
                            >
                                <div className="flex items-center space-x-2 justify-between">
                                    <span>{selectNum + ""}</span>
                                    <ChevronDown size={12} />
                                </div>
                            </EnhanceButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {dropdownOptions && dropdownOptions?.length > 0 && dropdownOptions?.map((option) => (
                                <DropdownMenuItem
                                    onSelect={option.action}
                                    key={option.key}
                                >
                                    {option.key}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            }
            <div className={cn("flex flex-1 items-center space-x-2", selectNum > 0 ? "pl-4" : "")}>
                <Input
                    placeholder="Filter title..."
                    value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("title")?.setFilterValue(event.target.value)
                    }
                    className="h-8 w-[150px] lg:w-[250px]"
                />
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset
                        <Cross2Icon className="ml-2 h-4 w-4" />
                    </Button>
                )}
                <DataTableViewOptions table={table} />
            </div>
            <div className="flex items-center space-x-4">

                {children && children}
            </div>
        </div>
    )
}