"use client";

import { getFile } from "@/lib/utils";
import dynamic from "next/dynamic";
import Script from "next/script";

const PDFViewer = dynamic(() => import("@/components/files/pdf-viewer"), { ssr: false });

const options = {
    showDisabledSaveButton: false,
    showAnnotationTools: false,
    showBookmarks: false,
    showPrintPDF: false,
}

const Pdf = ({ url }: { url: string }) => {
    return (
        <div className="md:h-[calc(100vh-112px)] h-[calc(100vh-56px)]">
            <Script src="https://documentcloud.adobe.com/view-sdk/main.js"></Script>
            <PDFViewer
                url={getFile(url, "")}
                viewerConfig={options} />
        </div>
    );
}


export default Pdf;