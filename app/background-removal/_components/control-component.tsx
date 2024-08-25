"use client";

import { EnhanceButton } from "@/components/ui/enhance-button";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const PlaceHolder = ({ previews }: { previews: string[] }) => {
    return (
        <div className="rounded-md pt-16" >
            <div className="mx-auto max-h-[480px] max-w-[480px] rounded-xl bg-gray-200">
                {previews.length > 0 && (
                    <Carousel className="w-full h-full">
                        <CarouselContent className="max-h-[480px] max-w-[480px] ml-0">
                            {previews.map((i, index) => (
                                <CarouselItem key={index} className="pl-0">
                                    <div className="w-full h-full mx-auto rounded-xl bg-gray-200">
                                        <img
                                            className="w-full h-full object-contain mx-auto rounded-md"
                                            src={i}
                                            alt="Original Image"
                                        />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                )}
            </div>
        </div>
    )
};


const Progress = ({ progress }: { progress: number }) => {
    return (
        <div className="h-full flex flex-col justify-center items-center space-y-4 px-4">
            <p>Progress: {progress}</p>
            <div
                className="w-full overflow-hidden rounded-full bg-gray-400 h-2"
            >
                <motion.div
                    className="h-2 bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                />
            </div>
        </div>
    )
}


type ControlProps = {
    images: File[]
    setRemoveBgImages: Dispatch<SetStateAction<Blob[]>>
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const ControlComponent: React.FC<ControlProps> = ({
    images,
    setRemoveBgImages,
    handleChange
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [previews, setPreviews] = useState<string[]>([]);

    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    async function removeBackground() {
        setRemoveBgImages([])
        if (images) {
            setProgress(0);
            setLoading(true);
            const imglyRemoveBackground = (await import('@imgly/background-removal'));
            toast.success("Removing background. Please wait...");

            setProgress(10);
            const increment = 90 / images.length;

            const allPromises = images.map((image) => imglyRemoveBackground.removeBackground(image).then((blobl) => {
                setProgress((prevProgress) => prevProgress + increment); // Increment progress
                return blobl;
            }))

            await Promise.all(allPromises).then((blobs) => {
                setRemoveBgImages(blobs);
            }).catch((error) => {
                console.error(error);
                toast.error("Something went wrong. Please try again later.");
            });
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!images) {
            setPreviews([])
            return
        }
        const objectUrls = images.map((image) => URL.createObjectURL(image));
        setPreviews(objectUrls);

        // free memory when ever this component is unmounted
        return () => objectUrls.forEach((url) => URL.revokeObjectURL(url));
    }, [images]);

    return (
        <div className="relative rounded-md border flex flex-col space-y-4 bg-gray-100 dark:bg-white/10 pb-8">
            <PlaceHolder previews={previews} />

            <div className="flex flex-col space-y-4">
                <input type="file" hidden accept="image/*" multiple ref={inputRef} onChange={handleChange} />
                <div className="m-auto grid grid-cols-2 gap-4 px-4 pt-16">
                    <EnhanceButton
                        onClick={() => inputRef.current?.click()}
                        variant={"outline"}
                        className={cn(
                            `rounded-full border p-2 max-w-xs`,
                        )}
                    >
                        <p>Upload images</p>
                    </EnhanceButton>
                    <EnhanceButton
                        disabled
                        variant={"outline"}
                        className={cn(
                            `rounded-full border p-2 max-w-xs`,
                        )}
                    >
                        <p>Storage images</p>
                    </EnhanceButton>
                </div>

                <div className="flex items-center justify-center pt-8 px-4 w-full">
                    <EnhanceButton
                        onClick={removeBackground}
                        variant={"outline"}
                        className={cn(
                            `rounded-full border p-2 w-full max-w-md`,
                        )}
                    >
                        <p>Start</p>
                    </EnhanceButton>
                </div>
            </div>


            {loading && (
                <div className="absolute top-0 right-0 bg-muted/90 w-full h-full">
                    <Progress progress={progress} />
                </div>
            )}
        </div>
    )
};


export default ControlComponent;