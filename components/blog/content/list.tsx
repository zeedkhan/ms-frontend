import { OutputBlockData } from "@editorjs/editorjs";
import { ListProps } from "./types";
import Markdown from "@/components/editor/markdown";

type ListCompoenentProps = {
    block: OutputBlockData<string, ListProps>;
}

export default function List({ block }: ListCompoenentProps) {
    const items = block.data.items;
    return (
        <ul className="list-disc pl-4 pt-2">
            {items.map((item, index) => (
                <li key={index}><Markdown content={item} /></li>
            ))}
        </ul>
    )

}