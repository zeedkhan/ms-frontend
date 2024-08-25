import { OutputBlockData } from "@editorjs/editorjs"
import { EmbedProps } from "./types"
import Markdown from "@/components/editor/markdown";

type EmbedComponentProps = {
    block: OutputBlockData<string, EmbedProps>
}

const EmbedComponent: React.FC<EmbedComponentProps> = ({ block }) => {
    return (
        <div className="w-full">
            <iframe
                className="w-full"
                style={{ margin: "auto" }}
                allow="accelerometer; 
        autoplay; 
        clipboard-write; 
        encrypted-media; 
        gyroscope; 
        picture-in-picture; 
        web-share"
                frameBorder="0"
                allowFullScreen
                src={block.data.embed}
                width={block.data.width}
                height={block.data.height}>
            </iframe>

            {block.data.caption && (
                <div className="mt-5 p-3 text-sm border-gray-200 border rounded-xl">
                    <Markdown content={block.data.caption} />
                </div>
            )}
        </div>
    )
};


export default EmbedComponent