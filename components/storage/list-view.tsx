import { useMemo } from "react";
import { DataTable } from "../ui/data-table/data-table";
import StorageStore from "@/state/storage";
import { z } from "zod";
import { columns, objectSchema } from "./columns";
import { deleteDirectory } from "@/db/directory";
import { deleteStorageFile } from "@/db/storage";

const ListView = () => {
    const { setDirectories, setFiles } = StorageStore();
    const directories = StorageStore((state) => state.directories);
    const files = StorageStore((state) => state.files);

    const objects = useMemo(() => {
        return z.array(objectSchema).parse([...directories, ...files].map((f: any) => ({ ...f, title: f.name, type: f.url ? "file" : "directory" })))
    }, [directories, files])

    const testFn = async (id: string) => {
        const isDirectory = directories.find((d) => d.id === id);
        const isFile = files.find((f) => f.id === id);
        if (isDirectory) {
            await deleteDirectory(id);
            setDirectories(directories.filter((d) => d.id !== id));
        } else if (isFile) {
            await deleteStorageFile(id);
            setFiles(files.filter((f) => f.id !== id));
        }
    }

    return (
        <DataTable
            columns={columns}
            data={objects}
            deleteFn={testFn}
            extraToolbar={null}
        />
    )
};


export default ListView;