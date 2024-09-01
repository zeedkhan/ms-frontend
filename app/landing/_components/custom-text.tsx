"use client";

import WavyText from "@/components/ui/wavy-text";
import WavyWords from "@/components/ui/wavy-words";
import { motion } from "framer-motion";
import { useRef } from "react";

type CustomTextProps = {
    head?: string;
    subHead?: string;
}

const CustomText: React.FC<CustomTextProps> = ({
    head,
    subHead
}) => {
    const ref = useRef<HTMLDivElement>(null)
    return (
        <motion.div
            className="text-3xl font-bold text-center"
            ref={ref}
        >
            {head && (
                <WavyText
                    text={head}
                    replay={true}
                    className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
                />
            )}
            {subHead && (
                <div className="pt-2">
                    <WavyWords
                        text={subHead}
                        className="bg-gradient-to-r from-purple-400 to-pink-600"
                    />
                </div>
            )}
        </motion.div>
    )
};


export default CustomText;