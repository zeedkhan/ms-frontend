"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import CustomText from "./custom-text";
import Link from "next/link";
import { EnhanceButton } from "@/components/ui/enhance-button";
import { MousePointerClick, SquareArrowOutUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import MagicButton from "@/components/ui/magic-button";
import { FaLocationArrow } from "react-icons/fa";

const CloudStorage: React.FC = () => {
    return (
        <div className="py-8">
            <div className="pb-8 pt-4">
                <CustomText
                    head="In Application Storage"
                    subHead="Like a Pro"
                />
            </div>
            <motion.div
                initial={{ opacity: 0, y: "-100%" }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.8,
                    delay: 0.5,
                    ease: [0, 0.71, 0.2, 1.01]
                }}
                className='h-80 px-2 origin-center w-full md:w-3/4 mx-auto'
            >
                <Card className='h-full w-full border-bone'>
                    <CardContent
                        className={cn(
                            `w-full h-full p-0 rounded-xl py-2`,
                            `flex justify-evenly items-center`
                        )}
                    >
                        <img
                            src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Package.png"
                            alt="Cloud Storage"
                            className="w-auto h-full "
                        />


                    </CardContent>
                </Card>


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
                <Link href="/storage">
                    <MagicButton
                        title="Get started"
                        icon={<MousePointerClick />}
                        position="right"
                    />
                </Link>
                <Link href="/blog/landing-storage">
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

export default CloudStorage;