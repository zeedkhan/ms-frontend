"use client";

import React, { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';
import { uploadImage } from '@/db/upload';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { uploadFileToStorage } from '@/db/user';
import { AiSVGLoader } from '../audio/ai-loader';
import { useRouter } from 'next/navigation';

const dataURLtoFile = (dataURL: string, filename: string): File => {
    const [header, data] = dataURL.split(',');
    const mime = header.match(/:(.*?);/)?.[1] || 'image/png';
    const byteString = atob(data);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uintArray = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
        uintArray[i] = byteString.charCodeAt(i);
    }
    return new File([arrayBuffer], filename, { type: mime });
};

const CombinedCapture: React.FC = () => {
    const captureRef = useRef<HTMLElement | null>(null);
    const [open, setOpen] = useState(false);
    const session = useSession();
    const router = useRouter();

    useEffect(() => {
        const mutationObserver = new MutationObserver((mutations) => {
            const mainDiv = document.querySelector("body main");
            if (mainDiv) {
                captureRef.current = mainDiv as HTMLElement;
            }
        });

        mutationObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        return () => {
            mutationObserver.disconnect();
        };
    }, [])

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, []);

    const upload = async (file: File, folder: string) => {
        try {
            const response = await uploadImage(file, folder);
            if (response.storePath) {
                const addStoratePath = await uploadFileToStorage({
                    key: response.storePath,
                    url: response.storePath,
                    userId: session.data?.user.id as string,
                    name: file?.name || "",
                    size: file?.size || 0,
                });
                toast.success('Capture successfully uploaded.');
            } else {
                toast.error('Error uploading capture.');
                console.error('Error uploading:', response);
            }
        } catch (error) {
            toast.error('Error uploading capture.');
            console.error('Error uploading:', error);
        }
    }

    const captureViewport = async () => {
        if (captureRef.current) {
            try {
                setOpen(false);
                const canvas = await html2canvas(captureRef.current);
                const imgData = canvas.toDataURL('image/png');
                const file = dataURLtoFile(imgData, 'viewport-capture.png');
                await upload(file, `user/${session.data?.user.id}/capture`);

            } catch (error) {
                toast.error('Error capturing viewport.');
                console.error('Error capturing viewport:', error);
            }
        }
    };

    const captureScreen = async () => {
        try {
            setOpen(false);

            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: true
            });
            const [track] = stream.getVideoTracks();
            // @ts-ignore
            const imageCapture = new ImageCapture(track);
            const bitmap = await imageCapture.grabFrame();
            const canvas = document.createElement('canvas');
            canvas.width = bitmap.width;
            canvas.height = bitmap.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(bitmap, 0, 0);
                const imgData = canvas.toDataURL('image/png');
                const file = dataURLtoFile(imgData, 'screen-capture.png');
                await upload(file, `user/${session.data?.user.id}/capture`);
            }
            track.stop();
        } catch (error) {
            console.error('Error capturing screen:', error);
        }
    };

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Suggestions">
                    <CommandItem
                        onSelect={() => {
                            router.push("/mic");
                            setOpen(false);
                        }}
                        className='cursor-pointer flex space-x-4 items-center justify-center'>
                        <div className="palette-2 w-fit h-fit scale-150 translate-x-1/2 translate-y-1/2">
                            <AiSVGLoader className='w-8 h-8 scale-150 ' />
                        </div>
                        <p className='font-semibold'>Talk with AI</p>
                    </CommandItem>
                    <CommandItem className='cursor-pointer' onSelect={captureScreen}>Screen capture</CommandItem>
                    <CommandItem className='cursor-pointer' onSelect={captureViewport}>Capture viewport</CommandItem>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
};

export default CombinedCapture;
