"use client";

import { Card, CardContent } from '@/components/ui/card';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import CustomText from './custom-text';
import Link from 'next/link';
import MagicButton from '@/components/ui/magic-button';
import { MousePointerClick, SquareArrowOutUpRight } from 'lucide-react';

const FADE_UP_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' } }
}

const Editor: React.FC = () => {
    const ref = useRef<HTMLDivElement>(null)
    const isInView2 = useInView(ref) as boolean;
    return (
        <div>
            <div
                className="py-8"
            >
                <CustomText
                    head="Background Removal"
                    subHead="Full Privacy Free"
                />
            </div>

            <motion.div
                initial="hidden"
                variants={FADE_UP_ANIMATION_VARIANTS}
                ref={ref}
                animate={isInView2 ? 'show' : 'hidden'}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
            >
                <motion.div className='max-w-3xl mx-auto flex items-center justify-center '>
                    <Card>
                        <CardContent className='p-0 rounded-xl'>
                            <img src='/editor.png' className='rounded-3xl h-auto w-full' alt='editor' />
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
                <Link href="/blog/e/new">
                    <MagicButton
                        title="Get started"
                        icon={<MousePointerClick />}
                        position="right"
                    />
                </Link>
                <Link href="/blog/landing">
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

export default Editor;