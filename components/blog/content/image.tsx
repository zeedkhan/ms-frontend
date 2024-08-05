import { OutputBlockData } from "@editorjs/editorjs";
import { ImageProps } from "./types";
import Image from "next/image";
import { cn } from "@/lib/utils";

type ImageComponentProps = {
    block: OutputBlockData<string, ImageProps>
}

const ImageComponent: React.FC<ImageComponentProps> = ({ block }) => {
    return (
        <figure>
            <Image
                src={block.data.file.url}
                width="0"
                height="0"
                sizes="100vw"
                className={cn(
                    "w-full h-auto rounded-xl",
                    block.data.withBackground && "bg-purple-100 h-[500px] p-16",
                    block.data.withBorder && "border border-gray-100"
                )}
                alt={block.data.caption || "image"}
            />
            {block.data.caption && (
                <figcaption className="border-gray-300 text-sm text-center border rounded-lg p-2 mt-1 mb-2">
                    {block.data.caption}
                </figcaption>
            )}
        </figure>
    )
}


export default ImageComponent;