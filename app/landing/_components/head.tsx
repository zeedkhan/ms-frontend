"use client";

import { cn } from '@/lib/utils';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const FADE_DOWN_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: -10 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' } }
}

type HeadProps = {
    title: string;
}

const Head: React.FC<HeadProps> = ({ title }) => {
    const ref = useRef<HTMLDivElement>(null)
    const isInView2 = useInView(ref) as boolean;
    return (
        <div className='pt-24'>
            <motion.div
                initial="hidden"
                variants={FADE_DOWN_ANIMATION_VARIANTS}
                ref={ref}
                animate={isInView2 ? 'show' : 'hidden'}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
            >
                <motion.div className='flex items-center justify-center px-8'>
                    <motion.h1 className={cn(
                        `bg-clip-text text-6xl font-extrabold text-transparent text-center inline-block `,
                        `bg-gradient-to-r from-fuchsia-500 to-cyan-500`
                    )}
                    >
                        {title}
                    </motion.h1>
                </motion.div>
            </motion.div>
        </div>
    )
};

export default Head;