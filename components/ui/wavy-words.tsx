"use client";

import { cn } from '@/lib/utils';
import { HTMLMotionProps, motion } from 'framer-motion';

interface WavyWordsProps extends HTMLMotionProps<"div"> {
    text: string;
}
const WavyWords: React.FC<WavyWordsProps> = ({
    text,
    className,
    ...props
}) => {
    const splitText = text.split(" ");

    return (
        <motion.div
            {...props}
            className={cn(
                `font-extrabold text-5xl text-transparent bg-clip-text`,
                className
            )}
        >
            {splitText.map((el, i) => (
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                        duration: 0.25,
                        delay: ((i + 1) / 10) * 2.5,
                    }}
                    key={i}
                >
                    {el}{" "}
                </motion.span>
            ))}
        </motion.div>
    )
};


export default WavyWords;