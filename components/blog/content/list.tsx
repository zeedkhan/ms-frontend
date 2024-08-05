import { OutputBlockData } from "@editorjs/editorjs";
import { ListProps } from "./types";

type ListCompoenentProps = {
    block: OutputBlockData<string, ListProps>;
}

export default function List({ block }: ListCompoenentProps) {
    const items = block.data.items;
    return (
        <ul className="list-disc pl-4 pt-2">
            {items.map((item, index) => (
                <li key={index}>{item}</li>
            ))}
        </ul>
    )

}