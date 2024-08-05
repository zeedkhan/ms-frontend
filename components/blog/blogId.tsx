"use client";

import { OutputData } from "@editorjs/editorjs";
import Markdown from "@/components/editor/markdown";
import { ReactNode, useEffect, useState } from "react";
import File from "./content/file";
import { Card, CardContent } from "../ui/card";
import Paragraph from "./content/paragraph";
import { Separator } from "@radix-ui/react-dropdown-menu";
import List from "./content/list";
import CheckList from "./content/check-list";
import Quote from "./content/quote";
import TableBlock from "./content/table-block";
import ImageComponent from "./content/image";
import AudioPlayer from "./content/audio-player";
import Mermaid from "./content/mermaid";
import EmbedComponent from "./content/embed";
import { ChevronDown } from "lucide-react";
// @ts-ignore
import edjsParser from "editorjs-parser"


type BlogIdProps = {
    content: OutputData;
};

const customRender = (content: OutputData) => {

    const parser = new edjsParser(undefined);

    return content.blocks.map((block) => {
        switch (block.type) {
            case "embed":
                return <EmbedComponent block={block} />
            case "image":
                return <ImageComponent block={block} />
            case "header":                
                return <>
                    <Markdown content={block.data.text} />
                    <Separator className="border-xl bg-gray-200 w-full h-0.5 " />
                </>
            case "paragraph":
                return <Paragraph text={block.data.text} />
            case "raw":
                return <Markdown content={block.data.html} />
            case "code":
                return <Markdown content={block.data.code} />
            case "list":
                return <List block={block} />
            case "attaches":
                return <File block={block} />
            case "checklist":
                return <CheckList block={block} />
            case "quote":
                return <Quote block={block} />
            case "table":
                return <TableBlock block={block} />
            case "delimiter":
                return <Separator className="border-xl bg-gray-200 w-full h-0.5 my-5" />
            case "audioPlayer":
                return <AudioPlayer src={block.data.src as string} />
            case "mermaid":
                return <Mermaid code={block.data.code} caption={block.data.caption} />
            default:
                return <Markdown content={block.data} />
        }
    })
}

const BlogId: React.FC<BlogIdProps> = ({ content }) => {
    const [test, setTest] = useState<ReactNode[]>([]);

    useEffect(() => {
        setTest(customRender(content));
    }, [content]);

    if (!content || !content.blocks) return null;

    return (
        <>
            <Card className=" bg-white w-full dark:text-black space-y-2 flex flex-col items-center justify-center px-4">
                <CardContent className="p-4 w-full max-w-3xl">
                    {test.map((dom, index) => (
                        <div key={index} className="p-1.5">
                            {dom}
                        </div>
                    ))}

                </CardContent>
            </Card>
        </>
    )
};

export default BlogId;