"use client";

import { useState, useEffect } from "react";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
// import "react-quill/dist/quill.snow.css";
// import ReactQuill from 'react-quill';
import "@cyntler/react-doc-viewer/dist/index.css";
import { getFile } from "@/lib/utils";
import MonacoEditor from "@monaco-editor/react";
import { EnhanceButton } from "../ui/enhance-button";

const HTML = ({ file }: { file: any }) => {
    const [htmlContent, setHtmlContent] = useState("");

    useEffect(() => {
        fetch(getFile(file.url, ""))
            .then(response => {
                return response.text()
            })
            .then(data => {
                setHtmlContent(data);
            });
    }, [file.url]);

    const handleEditorChange = (content: string) => {
        setHtmlContent(content);
    };

    const docs = [
        { uri: "data:text/html;base64," + btoa(htmlContent) },
    ];

    return (
        <div className="h-full">
            <EnhanceButton onClick={() => console.log(htmlContent)}>
                Click me
            </EnhanceButton>

            <DocViewer
                className="min-h-[50vh]"
                documents={docs}
                pluginRenderers={DocViewerRenderers}
            />

            <MonacoEditor
                className="min-h-[50vh]"
                language="html"
                value={htmlContent}
                onChange={(value) => handleEditorChange(value as string)}
                options={{
                    theme: "vs-dark",
                    automaticLayout: true,
                }}
            />
        </div>
    )
};

export default HTML;