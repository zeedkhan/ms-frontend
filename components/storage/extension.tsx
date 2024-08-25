import { SearchResult } from "@/types";
import { getMaterialFileIcon } from "file-extension-icon-js";
import { Folder } from "lucide-react";

type ExtensionProps = {
    file: SearchResult
}

const Extension: React.FC<ExtensionProps> = ({ file }: { file: SearchResult }) => {
    if (file.url) {
        return <img src={getMaterialFileIcon(file.url)} alt="file" className="h-6 w-6" />
    }
    return <Folder size={18} />
}


export default Extension;