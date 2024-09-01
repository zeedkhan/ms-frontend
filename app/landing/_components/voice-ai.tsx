"use client";

import { useInView } from "framer-motion";
import { useRef } from "react";
import { motion } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card";
import CustomText from "./custom-text";
import Link from "next/link";
import MagicButton from "@/components/ui/magic-button";
import { MousePointerClick, SquareArrowOutUpRight } from "lucide-react";

const FADE_UP_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' } }
}

const VoiceAI: React.FC = () => {
    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref) as boolean;
    return (
        <div className="pt-8">
            <div
                className="py-8"
            >
                <CustomText
                    head="AI Conversional Voice"
                    subHead="Talk to your AI assistant"
                />
            </div>

            <motion.div
                initial="hidden"
                variants={FADE_UP_ANIMATION_VARIANTS}
                ref={ref}
                animate={isInView ? 'show' : 'hidden'}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
            >
                <motion.div className='max-w-3xl mx-auto flex items-center justify-center'>
                    <Card className="rounded-xl">
                        <CardContent className='p-0 rounded-xl'>
                            <img src='/wireframe_chatbot.png' className='rounded-xl h-auto w-full' alt='Voice AI' />
                        </CardContent>
                    </Card>

                </motion.div>
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
                <Link href="/mic">
                    <MagicButton
                        title="Get started"
                        icon={<MousePointerClick />}
                        position="right"
                    />
                </Link>
            </motion.div>
        </div>
    )
};


export default VoiceAI;