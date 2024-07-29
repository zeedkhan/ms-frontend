interface ViewSDKClientConfig {
    clientId: string;
    divId?: string;
}

interface PreviewFileConfig {
    content: {
        location: {
            url: string;
        };
    };
    metaData: {
        fileName: string;
        id: string;
    };
}

interface PreviewFileUsingFilePromiseConfig {
    content: {
        promise: Promise<Blob>;
    };
    metaData: {
        fileName: string;
        id: string;
    };
}

interface AdobeDCView {
    previewFile: (config: PreviewFileConfig, viewerConfig: any) => Promise<void>;
    registerCallback: (type: string, handler: any, options: any) => void;
    getAPIs: () => Promise<any>;
}

declare global {
    interface Window {
        AdobeDC: {
            View: {
                new(config: ViewSDKClientConfig): AdobeDCView;
                Enum: {
                    CallbackType: {
                        SAVE_API: string;
                        EVENT_LISTENER: string;
                    };
                    ApiResponseCode: {
                        SUCCESS: string;
                    };
                };
            };
        };
    }
}

export default class ViewSDKClient {
    private readyPromise: Promise<void>;
    private adobeDCView: AdobeDCView | undefined;

    constructor() {
        this.readyPromise = new Promise((resolve) => {
            if (typeof window !== 'undefined' && window.AdobeDC) {
                resolve();
            } else {
                document.addEventListener("adobe_dc_view_sdk.ready", () => {
                    resolve();
                });
            }
        });
        this.adobeDCView = undefined;
    }

    ready(): Promise<void> {
        return this.readyPromise;
    }

    previewFile(divId: string, viewerConfig: any, url: string): Promise<any> {
        const config: ViewSDKClientConfig = {
            clientId: process.env.NEXT_PUBLIC_ADOBE_CLIENT_ID as string,
            divId,
        };

        this.adobeDCView = new window.AdobeDC.View(config);
        const previewFilePromise = this.adobeDCView.previewFile(
            {
                content: {
                    location: {
                        url: url,
                    },
                },
                metaData: {
                    fileName: "Menu.pdf",
                    id: "6d07d124-ac85-43b3-a867-36930f502ac6",
                },
            },
            viewerConfig
        );
        return previewFilePromise;
    }

    previewFileUsingFilePromise(divId: string, filePromise: Promise<Blob>, fileName: string): void {
        this.adobeDCView = new window.AdobeDC.View({
            clientId: process.env.NEXT_PUBLIC_ADOBE_CLIENT_ID as string,
            divId,
        });
        this.adobeDCView.previewFile(
            {
                content: {
                    // @ts-ignore
                    promise: filePromise,
                },
                metaData: {
                    fileName: fileName,
                    id: "6d07d124-ac85-43b3-a867-36930f502ac6", // or generate a unique ID if needed
                },
            },
            {}
        );
    }

    registerSaveApiHandler(): void {
        const saveApiHandler = (metaData: any, content: any, options: any): Promise<any> => {
            console.log(metaData, content, options);
            return new Promise((resolve) => {
                setTimeout(() => {
                    const response = {
                        code: window.AdobeDC.View.Enum.ApiResponseCode.SUCCESS,
                        data: {
                            metaData: Object.assign(metaData, {
                                updatedAt: new Date().getTime(),
                            }),
                        },
                    };
                    resolve(response);
                }, 2000);
            });
        };
        this.adobeDCView?.registerCallback(
            window.AdobeDC.View.Enum.CallbackType.SAVE_API,
            saveApiHandler,
            {}
        );
    }

    registerEventsHandler(apis: any): void {
        this.adobeDCView?.registerCallback(
            window.AdobeDC.View.Enum.CallbackType.EVENT_LISTENER,
            async (event: any) => {
                if (event.type === "PREVIEW_SELECTION_END") {
                    const selectedContent = await apis.getSelectedContent();
                    const selectedText = selectedContent.data;
                    console.log("Selected content:", selectedText);
                }
            },
            {
                // enablePDFAnalytics: true,
                // enableAnnotationEvents: true,
                enableFilePreviewEvents: true,
            }
        );
    }
}