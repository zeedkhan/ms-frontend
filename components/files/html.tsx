"use client";

import { getFile } from "@/lib/utils";
import { useEffect, useState } from "react";

type FileProps = {
    file: any;
};

const HTML: React.FC<FileProps> = ({ file }: { file: any }) => {
    const [html, setHtml] = useState("");
    useEffect(() => {
        fetch(getFile(file.url, ""))
            .then((res) => res.text())
            .then((html) => setHtml(html));
    }, []);

    return (
        <div
            dangerouslySetInnerHTML={{ __html: html }}
        >
        </div>
    );
};


export default HTML;