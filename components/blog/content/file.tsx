import { OutputBlockData } from "@editorjs/editorjs";
import { AttachesProps } from "./types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowDownIcon, ArrowRightIcon, ChevronDown, Download, Terminal } from "lucide-react";
import {
    getMaterialFileIcon,
    getMaterialFolderIcon,
    getVSIFileIcon,
    getVSIFolderIcon,
} from "file-extension-icon-js";
import { getFile } from "@/lib/utils";
import { EnhanceButton } from "@/components/ui/enhance-button";

type FileProps = {
    block: OutputBlockData<string, AttachesProps>;
}

export default function File({ block }: FileProps) {

    const onClick = () => {
        window.open(block.data.file.url, "_blank")
    }

    return (
        <Alert
            onClick={onClick}
            className="cursor-pointer mb-3 w-full flex items-center justify-between space-x-2 "
        >
            <div className="flex items-center space-x-2 ">
                <div className="bg-white rounded p-0.5">
                    <img src={getMaterialFileIcon(block.data.file.url)} alt="file" className="h-6 w-6" />
                </div>
                <AlertTitle className="text-center mb-0">{block.data.title || "Untitled"}</AlertTitle>
            </div>

            <div className="flex items-center space-x-2 ">
                <div className="rounded p-1 dark:bg-white bg-gray-100">
                    <ChevronDown size={20} className="text-black p-0.5" />
                    {/* <img src={getMaterialFileIcon(block.data.file.url)} alt="file" className="h-6 w-6" /> */}
                </div>
                {/* <AlertTitle className="text-center mb-0">{block.data.title || "Untitled"}</AlertTitle> */}
            </div>



            {/* <Terminal className="" /> */}

        </Alert>
    )
}