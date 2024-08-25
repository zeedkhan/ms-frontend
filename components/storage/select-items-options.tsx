import StorageStore from "@/state/storage";
import { useStore } from "zustand";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { EnhanceButton } from "../ui/enhance-button";
import { deleteStorageFile } from "@/db/storage";
import { toast } from "sonner";
import { deleteDirectory } from "@/db/directory";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ChevronDown, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { Command, CommandItem, CommandList } from "../ui/command";
import { Card, CardContent } from "../ui/card";

const SelectItemsOptions: React.FC = () => {
    const selectIds = useStore(StorageStore, state => state.selectIds);
    const setSelectIds = useStore(StorageStore, state => state.setSelectIds);
    const setFiles = useStore(StorageStore, state => state.setFiles);
    const setDirectories = useStore(StorageStore, state => state.setDirectories);
    const files = useStore(StorageStore, state => state.files);
    const directories = useStore(StorageStore, state => state.directories);


    const removeDirectory = async () => {
        const { ids } = selectIds;
        try {
            const allRequests = ids.map((id) => deleteDirectory(id));
            await Promise.all(allRequests);
            const filterDiretories = directories.filter((di) => !ids.includes(di.id));
            setDirectories(filterDiretories);
        } catch (err) {
            console.error(err);
            toast.error("Failed! Please try again");
        }
    };

    const removeFiels = async () => {
        const { ids } = selectIds;
        try {
            const allRequests = ids.map((id) => deleteStorageFile(id));
            await Promise.all(allRequests);
            const filterFiles = files.filter((fi) => !ids.includes(fi.id));
            setFiles(filterFiles);
        } catch (err) {
            console.error(err);
            toast.error("Failed! Please try again");
        }
    }

    const removeTasks = async () => {
        const { type, ids } = selectIds;
        try {
            if (type === "file") {
                await removeFiels();
            } else if (type === "directory") {
                await removeDirectory();
            }
            setSelectIds({ ids: [], type: "file" });
            toast.success(`${ids.length} ${type} removed successfully`);
        } catch (err) {
            console.error(err);
            toast.error("Failed! Please try again");
        }

    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                asChild
                className={cn(
                    selectIds.ids.length > 0 ? "block" : "hidden"
                )}
            >

                <Card
                    className={cn(
                        "dark:text-white text-black min-w-32 rounded-full h-full cursor-pointer my-8 active:scale-95 ",
                    )}
                >
                    <CardContent className="p-0 py-2 px-4 h-full w-full flex items-center justify-between text-sm">
                        {/* <File size={18} /> */}
                        <span>{selectIds.ids.length} {selectIds.type} selected</span>
                        <ChevronDown size={12} />
                    </CardContent>
                </Card>

            </DropdownMenuTrigger>
            <DropdownMenuContent className=" p-0">
                <Command>
                    <CommandList>
                        <CommandItem>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <div className="flex items-center space-x-2 justify-between px-2 text-sm cursor-pointer w-full">
                                        <span>Remove</span>
                                        <Trash size={16} />
                                    </div>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Are you sure to remove {selectIds.ids.length} {selectIds.type}?</DialogTitle>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <EnhanceButton
                                            onClick={removeTasks}
                                            size={"sm"}
                                            className="text-xs"
                                            variant={"gooeyRight"}
                                            type="submit"
                                        >
                                            Remove
                                        </EnhanceButton>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </CommandItem>
                    </CommandList>
                </Command>
            </DropdownMenuContent>
        </DropdownMenu>
    )
};


export default SelectItemsOptions;