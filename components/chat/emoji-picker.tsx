import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { SmileIcon } from "lucide-react";
import Picker from '@emoji-mart/react';
import data from "@emoji-mart/data"
import { useTheme } from "next-themes";

interface EmojiPickerProps {
    onChange: (value: string) => void;
}


export const EmojiPicker = ({
    onChange
}: EmojiPickerProps) => {

    const theme = useTheme();
    return (
        <Popover>
            <PopoverTrigger>
                <SmileIcon className="h-5 w-5 hover:text-foreground transition" />
            </PopoverTrigger>
            <PopoverContent
                className="bg-transparent border-none shadow-none w-full">
                <Picker
                    emojiSize={18}
                    theme={theme.theme === "dark" ? "dark" : "light"}
                    data={data}
                    maxFrequentRows={1}
                    onEmojiSelect={(emoji: any) => onChange(emoji.native)}
                />
            </PopoverContent>
        </Popover>
    )
}