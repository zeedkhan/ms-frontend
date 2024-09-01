"use client";

import Head from "./_components/head";
import BgRemoval from "./_components/bg-removal";
import CloudStorage from "./_components/cloud-storage";
import { InfiniteMovingCards } from "@/components/ui/infinate-cards";
import WavyWords from "@/components/ui/wavy-words";
import Editor from "./_components/editor";
import MagicButton from "@/components/ui/magic-button";
import { MousePointerClick } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { testimonials } from "./_data";
import Grid from "./_components/grid";
import VoiceAI from "./_components/voice-ai";
import Bg from "./_components/bg";
import RecentProjects from "./_components/recent-projects";

export default function Page() {
    return (
        <div className="relative w-full h-full pb-16 px-4 overflow-hidden">
            <Head title='Welcome' />
            <Bg />

            <WavyWords
                text={"Hello! I'm Seed, Frontend Developer & Marketing Specialist"}
                className="max-w-lg mx-auto pt-4 text-center bg-gradient-to-r from-purple-300 via-violet-600 to-fuchsia-400 bg-clip-text text-transparent"
            />

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="text-center text-xl pt-16">
                A passionate developer with a, based in Thailand and Malaysia.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="pt-16 flex items-center justify-center">
                <Link
                    href={"#work"}
                >
                    <MagicButton
                        title="Get started"
                        icon={<MousePointerClick />}
                        position="right"
                    />
                </Link>
            </motion.div>


            <div className="flex items-center justify-center">
                <Grid />
            </div>


            <section
                className="py-8"
                id="marketing"
            >
                <motion.h2
                    className="py-8 text-4xl font-semibold text-center">
                    Merketing {" "}
                    <motion.span
                        className="bg-gradient-to-r from-purple-300 via-violet-600 to-blue-300 bg-clip-text text-transparent"
                    >
                        Specialist skills
                    </motion.span>
                </motion.h2>

                <div
                    className="h-[50vh] md:h-[30rem] rounded-md flex flex-col antialiased  items-center justify-center relative overflow-hidden"
                >
                    <InfiniteMovingCards
                        items={testimonials}
                        direction="left"
                        speed="slow"
                    />
                </div>
            </section>

            <section
                className="py-8"
                id="work"
            >
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="py-8 text-4xl font-semibold text-center"
                >
                    My work {" "}
                    <motion.span
                        className="bg-gradient-to-r from-purple-300 via-violet-600 to-blue-300 bg-clip-text text-transparent"
                    >
                        experience
                    </motion.span>
                </motion.h2>

                <Editor />

                <VoiceAI />

                <BgRemoval />
                <CloudStorage />
            </section>

            <RecentProjects />


        </div>
    )
}