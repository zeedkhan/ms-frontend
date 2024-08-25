"use client";

import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import DownloadZip from "@/components/download-zip";
import { useEffect, useState } from "react";
import { EnhanceButton } from "@/components/ui/enhance-button";
import { useSession } from "next-auth/react";
import { uploadFile } from "@/db/upload";
import { uploadFileToStorage } from "@/db/storage";
import { toast } from "sonner";
import { Download } from "lucide-react";

type RightPanelProps = {
    removeBgImages: Blob[];
}

const RemovedBackground: React.FC<RightPanelProps> = ({ removeBgImages }) => {
    const [previews, setPreviews] = useState<string[]>([]);
    const session = useSession();

    const upload = async () => {
        const allRequests = removeBgImages.map((file) =>
            uploadFile(new File([file], "remove-bg.png"), session.data?.user.id as string).then((response) => {
                if (response.storePath) {
                    return uploadFileToStorage({
                        key: response.storePath,
                        url: response.storePath,
                        userId: session.data?.user.id as string,
                        name: "remove-bg" || "",
                        size: file?.size || 0,
                    });
                }
            }).catch((err) => {
                console.error('Error uploading:', err);
                toast.error('Error uploading capture.');
            })
        );

        try {
            const responses = await Promise.all(allRequests);
            toast.success('Capture successfully uploaded.');
        } catch (error) {
            toast.error('Error uploading capture.');
            console.error('Error uploading:', error);
        }
    };

    useEffect(() => {
        const previews = removeBgImages.map((i) => URL.createObjectURL(i));
        setPreviews(previews);

        return () => {
            previews.forEach((i) => URL.revokeObjectURL(i));
        }
    }, [removeBgImages])


    if (!session.data) return null;

    return (
        <div className="rounded-md pt-16 border bg-gray-100 dark:bg-slate-500/30 pb-8">
            <div className="mx-auto max-h-[480px] max-w-[480px] rounded-xl bg-gray-200">
                {previews.length > 0 && (
                    <Carousel className="w-full h-full">
                        <CarouselContent className="max-h-[480px] max-w-[480px] ml-0">
                            {previews.map((i, index) => (
                                <CarouselItem key={index} className="pl-0">
                                    <div className="w-full h-full mx-auto rounded-xl bg-gray-200">
                                        <img
                                            className="w-full h-full object-contain mx-auto"
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


            <div className="pt-8 px-4 flex flex-col space-y-4">

                <div className="flex items-center justify-center w-full">
                    <EnhanceButton
                        className="rounded-full border flex items-center space-x-4 px-8 py-5"
                        variant={"outline"}
                        size={'sm'}

                        onClick={upload}
                    >

                        <Download />
                        <p>Save to storage</p>
                    </EnhanceButton>
                </div>

                <div className="flex items-center justify-center  w-full">
                    <DownloadZip
                        files={removeBgImages}
                    />
                </div>
            </div>


        </div>
    )
};


export default RemovedBackground;