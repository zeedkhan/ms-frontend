import "./loader.css";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";


export const AiSVGLoader = ({ className }: { className: string }) => {
    return (
        <div className={`blobs ${className}`}>
            <svg viewBox="0 0 1200 1200">
                <g className="blob blob-1 ">
                    <path />
                </g>
                <g className="blob blob-2">
                    <path />
                </g>
                <g className="blob blob-3">
                    <path />
                </g>
                <g className="blob blob-4">
                    <path />
                </g>
                <g className="blob blob-1 alt">
                    <path />
                </g>
                <g className="blob blob-2 alt">
                    <path />
                </g>
                <g className="blob blob-3 alt">
                    <path />
                </g>
                <g className="blob blob-4 alt">
                    <path />
                </g>
            </svg>
        </div>
    )
}

export default function AiLoader({ thinking, listening }: { thinking: boolean, listening: boolean }) {
    if (!thinking && !listening) {
        return null
    }
    const styleAnimation = thinking ? "palette-2" : listening ? "palette-5" : ""

    return (
        <motion.div
            animate={{ scale: [1, 1.1, 1.2, 1.15, 1.1, 1.05, 1] }}
            transition={{ duration: 5, yoyo: Infinity, repeat: Infinity, repeatType: "reverse" }}
            className={cn(
                "container absolute w-fit h-fit top-1/2 right-1/2",
                `${styleAnimation}`
            )}>
            <p className="absolute top-1/2 right-1/2 -translate-y-1/2 translate-x-1/2 text-black z-[50]">
                {thinking ? "Thinking" : "Listening"}
            </p>
            <AiSVGLoader className="h-40 w-40" />
        </motion.div>
    )
}