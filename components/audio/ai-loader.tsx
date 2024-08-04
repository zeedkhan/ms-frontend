import "./loader.css";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function AiLoader({ thinking }: { thinking: boolean }) {

    return (
        <motion.div
            animate={{ scale: [1, 1.1, 1.2, 1.15, 1.1, 1.05, 1] }}
            transition={{ duration: 5, yoyo: Infinity, repeat: Infinity, repeatType: "reverse" }}
            className={cn(
                "container  absolute w-fit h-fit top-1/2 right-1/2",
                `${thinking ? "palette-2" : "palette-5"}`
            )}>
            <div className="blobs h-40 w-40">
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
        </motion.div>
    )
}