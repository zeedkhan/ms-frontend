"use client";


import { OutputData } from "@editorjs/editorjs";

// @ts-ignore
import edjsParser from "editorjs-parser"
import Markdown from "@/components/editor/markdown";
import { useEffect, useState } from "react";


function detectLanguage(codeString: string | null) {
    if (!codeString) return false;
    const languages = {
        python: [/def /, /import /, /print\(/],
        javascript: [/function /, /console\.log/, /let /, /const /],
        java: [/public class /, /System\.out\.println/, /import java\./],
        cpp: [/#include/, /cout<<</, /std::/],
    };

    for (const [language, patterns] of Object.entries(languages)) {
        if (patterns.some(pattern => pattern.test(codeString))) {
            return language;
        }
    }

    return false;
}

const traverseDom = (DOM: Document) => {
    const body = DOM.body;
    let temp: Element | null = body.firstElementChild;
    const allDoms = [];
    while (temp) {
        const isProgramming = detectLanguage(temp.textContent)
        if (isProgramming) {
            allDoms.push('```' + isProgramming + temp.textContent)
        } else {
            allDoms.push(temp.innerHTML)
        }

        temp = temp.nextElementSibling
    }

    return allDoms;
}

type BlogIdProps = {
    content: OutputData;
};

const BlogId: React.FC<BlogIdProps> = ({ content }) => {
    const [parsedContent, setParsedContent] = useState<string[]>([]);
    const customParsers = {
        raw: function (data: any, config: any) {
            return `<code>${data.html}</code>`
        },
    }

    useEffect(() => {
        const parser = new edjsParser(undefined, customParsers);
        const markup = parser.parse(content);

        const par = new DOMParser();
        const DOM = par.parseFromString(markup, "text/html");
        const extractedDoms = traverseDom(DOM);
        setParsedContent(extractedDoms || []);

    }, [content]);

    if (!content || !content.blocks) return null;

    return (
        <div className="space-y-2 flex flex-col items-center justify-center pt-16 px-4">
            {parsedContent.map((dom, index) => (
                <div key={index}>
                    <Markdown content={dom || ""} />
                </div>
            ))}
        </div>
    )
};

export default BlogId;