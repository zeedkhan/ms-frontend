"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Paperclip, SendIcon } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";

type ChatInputProps = {
    onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
    files: FileList | undefined;
    fileInputRef: React.RefObject<HTMLInputElement>;
    handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    input: string;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
    onSubmit,
    input,
    handleInputChange,
    handleFileChange,
    files,
    fileInputRef
}) => {
    const [isMultipleLine, setIsMultiline] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const checkMultiline = (val: string) => (textareaRef.current?.value.match(/\n/g) || []).length > 1;
    const handleInnerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto"; // Reset height to calculate new height
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`; // Limit max height to 180px
        }
        checkMultiline(e.target.value) ? setIsMultiline(true) : setIsMultiline(false);
    }

    return (
        <Card
            className={cn(
                `min-h-[52px] shadow-lg max-w-3xl w-full px-4 absolute bottom-4 left-1/2 transform -translate-x-1/2`,
                isMultipleLine ? "rounded-3xl" : "rounded-full"
            )}>
            <CardContent className="p-0">
                <form
                    className="flex flex-col"
                    onSubmit={onSubmit}
                >
                    {files && files.length > 0 && (
                        <p className="px-4 text-gray-500 text-sm">
                            {files.length} file{files.length > 1 ? "s" : ""} selected
                        </p>
                    )}

                    <div className="flex items-center space-x-3 min-h-[52px]">
                        <button
                            type="button"
                            aria-label="Attach file"
                            className="flex items-center"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Paperclip className="cursor-pointer" size={20} />
                        </button>
                        <input
                            type="file"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            multiple
                        />

                        {/* Textarea for Chat Input */}
                        <Textarea
                            ref={textareaRef}
                            style={{
                                resize: "none",
                                minHeight: "24px",
                                maxHeight: "180px"
                            }}
                            className="h-auto w-full shadow-none border-none rounded-lg overflow-hidden overflow-y-auto"
                            placeholder="Type your message..."
                            value={input}
                            onChange={(e) => {
                                handleInputChange(e);
                                handleInnerChange(e);
                            }}
                            rows={1}
                            aria-label="Chat input"
                        />

                        {/* Send Button */}
                        <button
                            type="submit"
                            aria-label="Send message"
                            className="rounded-full h-9 p-2 bg-primary disabled:bg-gray-600 text-white dark:bg-white dark:text-black flex items-center justify-center"
                            disabled={!input.trim() && !files}
                        >
                            <SendIcon size={18} />
                        </button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default ChatInput;
