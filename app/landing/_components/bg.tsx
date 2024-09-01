"use client";

import GridGlobe from "./grid-globe";
import { motion } from "framer-motion";

const Bg: React.FC = () => {
    const FADE_DOWN_ANIMATION_VARIANTS = {
        hidden: { opacity: 0, y: -10 },
        show: { opacity: 1, y: 0, transition: { type: 'spring' } }
    }
    return (
        <div className="z-[-1] pointer-events-none inset-0 absolute w-full h-full">
            <div className="fixed w-full h-full m-auto">

                <GridGlobe />

                {/* <motion.div
                    animate="show"
                    variants={FADE_DOWN_ANIMATION_VARIANTS}

                >
                </motion.div> */}
            </div>
        </div>
    )
};


export default Bg;