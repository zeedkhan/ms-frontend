"use client";

import { useEffect, useRef, useState } from "react";
import ViewSDKClient from "./pdf-view-sdk-client";

interface PDFViewerProps {
    url: string;
    viewerConfig: any;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ url, viewerConfig }) => {
    const [sdkClient, setSdkClient] = useState<ViewSDKClient | null>(null);
    const divRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const client = new ViewSDKClient();
            client.ready().then(async () => {
                if (divRef.current) {
                    const previewFilePromise = await client.previewFile(divRef.current.id, viewerConfig, url);
                    const apis = await previewFilePromise.getAPIs();
                    client.registerEventsHandler(apis);
                    // client.previewFile(divRef.current.id, viewerConfig, url);
                    // client.registerEventsHandler();
                    client.registerSaveApiHandler();
                }
            });
            setSdkClient(client);
        }
    }, [url, viewerConfig]);

    return <div id="adobe-dc-view" className="" ref={divRef} ></div>;
};

export default PDFViewer;