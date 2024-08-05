"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Scroll() {
    const [currentScorll, setCurrentScroll] = useState(0);

    useEffect(() => {
        const handle = () => {
            const scroll = window.scrollY;
            const height = document.body.scrollHeight - window.innerHeight;
            const scrolled = (scroll / height) * 100;
            setCurrentScroll(scrolled);
        }

        document.addEventListener('scroll', handle)

        return () => {
            document.removeEventListener('scroll', handle)
        }
    }, [])

    return (
        <motion.div className="progress-bar dark:bg-gray-200 bg-red-500 " style={{ scaleX: currentScorll + "%" }} />
    );
}