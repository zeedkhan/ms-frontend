"use client";

import { StorageFile } from "@/types"
import { useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Card } from "../ui/card";
import { cn, getFile, openFileStorage } from "@/lib/utils";
import { File } from "../chat/message-file";
import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowRightIcon, CircleFadingPlus, CircleX, Copy } from "lucide-react";
import { useCopyToClipboard } from 'usehooks-ts'
import { toast } from "sonner";
import { uploadFile } from "@/db/upload";
import { uploadFileToStorage } from "@/db/user";
import { useSession } from "next-auth/react";
import { EnhanceButton } from "../ui/enhance-button";

type StorageItemsProps = {
    items: StorageFile[];
}

const StorageItems: React.FC<StorageItemsProps> = ({ items }) => {
    const [selectedId, setSelectedId] = useState('');
    const [copiedText, copy] = useCopyToClipboard();
    const session = useSession();

    const inputRef = useRef<HTMLInputElement>(null);

    const handleCopy = (text: string) => () => {
        copy(text).then(() => {
            toast.success("Copied to clipboard!")
        }).catch(error => {
            console.error('Failed to copy!', error);
            toast.success("Failed to copy!")
        });
    };

    const handleClick = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };

    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            await upload(file, session.data?.user.id as string);
        }
    }

    const upload = async (file: File, folder: string) => {
        try {
            const response = await uploadFile(file, folder);
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

    return (
        <div className="md:min-h-[calc(100vh-200px)] min-h-[calc(100vh-112px)]">
            <motion.div className="flex items-start justify-evenly">
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 w-full p-8">
                    {items.map((item) => (
                        <motion.div
                            className={cn(
                                `max-w-60 mx-auto sm:mx-0 rounded-lg shadow-md cursor-pointer transform`
                            )}
                            layoutId={`card-container-${item.id}`}
                            onClick={() => setSelectedId(item.id)}
                            key={item.id}
                            initial={{ scale: 1 }}
                            animate={{ scale: selectedId === item.id ? 1.05 : 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="p-2 transition scale-100 duration-100 hover:scale-105">
                                <div className="h-32 overflow-hidden">
                                    <File file={item} />
                                </div>
                                <motion.h2 className="font-bold mb-2">{item.name}</motion.h2>
                                <motion.h5 className="text-sm font-bold mb-1 text-gray-700 dark:text-white ">modified at: {item.size}</motion.h5>
                                <motion.p className="text-sm font-bold mb-1 text-gray-700 dark:text-white">size: {item.size}</motion.p>
                            </Card>
                        </motion.div>
                    ))}
                </div>


                {/* {selectedId && (
                    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-r from-teal-400/40 to-blue-500/40" />
                )} */}

                <AnimatePresence>
                    {selectedId && (
                        <motion.div
                            className="fixed inset-0 bg-opacity-50 flex items-center justify-center "
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {items.map((item) => (
                                item.id === selectedId && (
                                    <motion.div
                                        className="bg-white rounded-lg p-4 shadow-md w-full max-w-2xl"
                                        layoutId={`card-container-${item.id}`}
                                        key={item.id}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.8, opacity: 0 }}
                                    >
                                        <motion.div className="relative">
                                            <motion.button
                                                className="absolute top-2 right-2 py-1 px-2 text-center rounded-full bg-red-600 text-white"
                                                onClick={() => setSelectedId('')}
                                            >
                                                <CircleX />
                                            </motion.button>
                                            <motion.div
                                                className="text-md flex items-center justify-center"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                            >
                                                <File file={item} />
                                            </motion.div>
                                            <motion.h2 className="font-bold mb-2 dark:text-black">{item.name}</motion.h2>
                                            <motion.h5 className="text-sm font-bold mb-1 text-gray-700 dark:text-black">modified at: {item.size}</motion.h5>
                                            <motion.h5 className="text-sm font-bold mb-1 text-gray-700">size: {item.size}</motion.h5>
                                            <motion.div className="text-sm font-bold mb-1 text-gray-700 grid grid-cols-2 pt-4 items-center justify-between">
                                                <div className="flex space-x-4 items-center justify-center">
                                                    <EnhanceButton
                                                        variant={"gooeyRight"}
                                                    >
                                                        <Link
                                                            className="truncate"
                                                            rel="noopener noreferrer"
                                                            target="_blank"
                                                            href={openFileStorage(item.id)}
                                                        >
                                                            Viewer
                                                        </Link>
                                                    </EnhanceButton>
                                                    <Button type="submit" size="sm" className="px-3">
                                                        <span className="sr-only">Copy</span>
                                                        <Copy className="h-4 w-4" onClick={handleCopy(openFileStorage(item.id))} />
                                                    </Button>
                                                </div>
                                                <div className="flex space-x-4 items-center justify-center">
                                                    <EnhanceButton
                                                        variant={"gooeyRight"}
                                                    >
                                                        <Link
                                                            className="truncate"
                                                            rel="noopener noreferrer"
                                                            target="_blank"
                                                            href={getFile(item.url, "")}
                                                        >
                                                            View as public
                                                        </Link>
                                                    </EnhanceButton>
                                                    <Button type="submit" size="sm" className="px-3">
                                                        <span className="sr-only">Copy</span>
                                                        <Copy className="h-4 w-4" onClick={handleCopy(getFile(item.url, ""))} />
                                                    </Button>
                                                </div>
                                            </motion.div>
                                        </motion.div>
                                    </motion.div>
                                )
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            <div className="fixed md:bottom-20 md:right-20 bottom-10 right-10 z-50 ">
                <div className="animate-bounce hover:animate-none shadow-xl rounded-full p-1 border-2 cursor-pointer text-red-600 dark:bg-white">
                    <input type="file" ref={inputRef} hidden onChange={onFileChange} />
                    <CircleFadingPlus size={32} onClick={handleClick} />
                </div>
            </div>

        </div>
    );
};

StorageItems.displayName = "StorageItems";

export default StorageItems;