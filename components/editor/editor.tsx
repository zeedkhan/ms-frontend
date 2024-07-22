"use client";

import React, { useCallback, useEffect, useRef } from "react";
import EditorJS, { OutputData, ToolConstructable } from "@editorjs/editorjs";
import CheckList from "@editorjs/checklist";
import Code from "@editorjs/code";
//@ts-ignore
import Delimiter from "@editorjs/delimiter";
import Embed from "@editorjs/embed";
//@ts-ignore
import InlineCode from "@editorjs/inline-code";
//@ts-ignore
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import Table from "@editorjs/table";
import SimpleImage from "@editorjs/simple-image";
//@ts-ignore
import Paragraph from "@editorjs/paragraph";
import Header from "@editorjs/header";
//@ts-ignore
import Raw from "@editorjs/raw";

import "./editor-style.css"
import ImageTool from "@editorjs/image";
import { uploadFile } from "@/db/upload";
import { getFile } from "@/lib/utils";

interface EditorProps {
    data: OutputData;
    holder: string;
    onChange: any;
    userId: string;
    blogId: string | null;
}

const EDITOR_TOOLS = {
    code: Code,
    image: {
        class: ImageTool as unknown as ToolConstructable,
        config: {
            uploader: {
                async uploadByFile(file: File) {
                    const res = await uploadFile(file);
                    return {
                        success: 1,
                        file: {
                            url: getFile(res.storePath, "image")
                        },
                    }
                }
            }
        }
    },
    header: {
        class: Header,
        shortcut: "CMD+H",
        inlineToolbar: true,
        config: {
            placeholder: "Enter a Header",
            levels: [2, 3, 4],
            defaultLevel: 2,
        },
    },
    paragraph: {
        class: Paragraph,
        // shortcut: 'CMD+P',
        inlineToolbar: true,
    },
    checklist: CheckList,
    inlineCode: InlineCode,
    table: Table,
    list: List,
    quote: Quote,
    delimiter: Delimiter,
    raw: Raw,
};
const Editor: React.FC<EditorProps> = ({ data, holder, onChange, userId, blogId }) => {

    const editorRef = useRef<EditorJS | null>(null);

    // Initialize the editor when the component mounts
    const cb = useCallback(() => {
        //initialize editor if we don't have a reference
        if (!editorRef.current) {
            const editor = new EditorJS({
                holder: holder,
                placeholder: "Start writting here..",
                tools: EDITOR_TOOLS,
                data,
                async onChange(api, event) {
                    const content = await api.saver.save();
                    // console.log(content, "sdfb");
                    onChange(content);
                },
            });
            editorRef.current = editor;
        }

        //add a return function handle cleanup
        return () => {
            if (editorRef.current && editorRef.current.destroy) {
                editorRef.current.destroy();
            }
        };
    }, [data, onChange, holder]);

    useEffect(() => {
        cb();
    }, [cb]);

    return (
        <div className="p-5 flex flex-col space-y-4">
            <div className="editor-container dark:text-black">
                <div id={holder}>
                    <div id="editor-container"></div>
                </div>
            </div>
        </div>

    );
}

export default Editor;