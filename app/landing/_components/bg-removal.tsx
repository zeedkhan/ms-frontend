"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ReactCompareSlider, ReactCompareSliderImage } from "react-compare-slider";
import CustomText from "./custom-text";
import { EnhanceButton } from "@/components/ui/enhance-button";
import { MousePointerClick, SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import MagicButton from "@/components/ui/magic-button";
import { AspectRatio } from "@/components/ui/aspect-ratio";


const BgRemoval: React.FC = () => {
    return (
        <div className="pt-8">
            <div className="py-8">
                <CustomText
                    head="Background Removal"
                    subHead="Full Privacy Free"
                />
            </div>

            <motion.div
                className='px-2 origin-center w-full md:w-3/4 mx-auto'
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{
                    opacity: 1, scale: 1,
                }}
                transition={{
                    duration: 0.8,
                    delay: 0.5,
                    ease: [0, 0.71, 0.2, 1.01]
                }}
            >
                <AspectRatio ratio={16 / 9} className=" max-w-2xl mx-auto bg-muted h-full w-full rounded-xl">
                    <ReactCompareSlider
                        className='w-full h-full rounded-xl'
                        itemOne={<ReactCompareSliderImage src="./removed-background.png" alt="Removed background" />}
                        itemTwo={<ReactCompareSliderImage src="./orignal-image.png" alt="Original Image" />}
                    />
                </AspectRatio>
            </motion.div>

            <motion.div
                className="flex justify-center space-x-4 pt-8"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{
                    opacity: 1, scale: 1,
                }}
                transition={{
                    duration: 0.8,
                    delay: 1,
                    ease: [0, 0.71, 0.2, 1.01]
                }}
            >
                <Link href="/background-removal">
                    <MagicButton
                        title="Get started"
                        icon={<MousePointerClick />}
                        position="right"
                    />
                </Link>
                <Link href="/blog/landing-bg-removal">
                    <MagicButton
                        title="How I built it?"
                        icon={<SquareArrowOutUpRight />}
                        position="right"
                    />
                </Link>
            </motion.div>
        </div>
    )
};


export default BgRemoval;