"use client";

import { useCallback, useRef, useState } from "react";
import { DropArea } from "./drop-area";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ControlComponent from "./control-component";
import RemovedBackground from "./removed-background";
import { cn } from "@/lib/utils";

const Content: React.FC = () => {
    const [images, setImages] = useState<File[]>([]);
    const [removeBgImages, setRemoveBgImages] = useState<Blob[]>([]);

    const handleFileDrop = useCallback(
        (item: { files: any[] }) => {
            if (item) {
                const files = item.files
                setImages(files)
            }
        },
        [setImages],
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files?.length) {
            setImages((prev) => [...prev, ...Array.from(files)]);
        }
    };

    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div
            className="h-full max-h-[calc(100vh-176px)] overflow-hidden overflow-y-auto">
            {images.length === 0 && (
                <DndProvider
                    backend={HTML5Backend}
                >
                    <input type="file" hidden accept="image/*" multiple ref={inputRef} onChange={handleChange} />
                    <DropArea
                        onClick={() => inputRef.current?.click()}
                        onDrop={handleFileDrop} />
                </DndProvider>
            )}
            {images.length > 0 && (
                <div className={cn(
                    `w-full h-full flex flex-col space-y-4`
                )}>
                    {removeBgImages.length > 0 && (
                        <RemovedBackground removeBgImages={removeBgImages} />
                    )}
                    <ControlComponent
                        handleChange={handleChange}
                        images={images}
                        setRemoveBgImages={setRemoveBgImages}
                    />

                </div>
            )}

        </div>
    )
};

export default Content;