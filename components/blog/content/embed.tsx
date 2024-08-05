import { OutputBlockData } from "@editorjs/editorjs"
import { EmbedProps } from "./types"

type EmbedComponentProps = {
    block: OutputBlockData<string, EmbedProps>
}

const EmbedComponent: React.FC<EmbedComponentProps> = ({ block }) => {
    return (
        <div>
            <iframe
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

            <div className="mt-5 p-3 text-sm border-gray-200 border rounded-xl">
                {block.data.caption && (
                    <p>{block.data.caption}</p>
                )}
            </div>
        </div>
    )
};


export default EmbedComponent