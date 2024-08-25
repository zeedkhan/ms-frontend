"use client";

import { useState, useEffect } from "react";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";
import { getFile } from "@/lib/utils";
import MonacoEditor from "@monaco-editor/react";
import { EnhanceButton } from "../ui/enhance-button";
import { encode } from 'js-base64';
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";

const HTML = ({ file }: { file: any }) => {
    const [content, setContent] = useState("");
    const [defaultContent, setDefaultContent] = useState("");
    const [autoSave, setAutoSave] = useState(false);

    useEffect(() => {
        fetch(getFile(file.url, ""))
            .then(response => {
                return response.text()
            })
            .then(data => {
                setContent(data);
                setDefaultContent(data);
            });
    }, [file.url]);

    useEffect(() => {
        let time: NodeJS.Timeout;
        if (!autoSave) return;
        time = setTimeout(() => {
            setDefaultContent(content);
        }, 1500);
        return () => {
            console.log("clear")
            clearTimeout(time)
        };
    }, [content, autoSave]);

    const docs = [
        { uri: "data:text/html;base64," + encode(defaultContent) },
    ];
    return (
        <div className="h-full flex flex-col space-y-4">
            <DocViewer
                className="min-h-[50vh]"
                documents={docs}
                pluginRenderers={DocViewerRenderers}
            />
            <div
                className="flex justify-end"
            >
                <div className="flex items-center space-x-2 mr-4">
                    <Switch id="auto-save" checked={autoSave} onCheckedChange={setAutoSave} className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500" />
                    <Label htmlFor="auto-save">Auto Save</Label>
                </div>

                <EnhanceButton
                    size={"sm"}
                    className="mr-4"
                    onClick={() => console.log(content)}>
                    Save
                </EnhanceButton>
            </div>
            <MonacoEditor
                className="min-h-[50vh] border-dashed rounded"
                language="html"
                value={defaultContent}
                onChange={(value) => setContent(value as string)}
                options={{
                    theme: "light",
                    automaticLayout: true,
                }}
            />
        </div>
    )
};

export default HTML;