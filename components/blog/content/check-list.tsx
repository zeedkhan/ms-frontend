import { OutputBlockData } from "@editorjs/editorjs";
import { CheckListProps } from "./types";
import { Checkbox } from "@/components/ui/checkbox";
import Markdown from "@/components/editor/markdown";

type CheckListPropsComponent = {
    block: OutputBlockData<string, CheckListProps>;
}

export default function CheckList({ block }: CheckListPropsComponent) {
    const items = block.data.items;
    return (
        <div className="flex flex-col space-y-3 shadow rounded-xl p-4 border dark:bg-black dark:text-white">
            {items.map((item, index) => (
                <div key={index} className="flex flex-row items-center space-x-3">
                    <Checkbox checked={item.checked} onChange={() => { }} className="dark:bg-white" />
                    <Markdown content={item.text} />
                </div>
            ))}
        </div>
    )
}