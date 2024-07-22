"use client";

import { useHoveredParagraphCoordinate } from "@/hooks/use-mouse";
import { getTopLevelReadableElementsOnPage } from "@/lib/parser";
import { speech } from "@/lib/play";
import { useEffect, useRef, useState } from "react";
import PlayIcon from "./icon/play-icon";
import PauseIcon from "./icon/pause-icon";

export default function HoverPlayer() {
    const [allElements, setAllElments] = useState<HTMLElement[]>(getTopLevelReadableElementsOnPage());
    const isHover = useHoveredParagraphCoordinate(allElements as HTMLElement[]);
    const [playRef, setPlayRef] = useState<SpeechSynthesis | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const playingElement = useRef<HTMLElement | null>(null);
    const top = isHover ? isHover?.top || 0 : 0;
    const left = isHover ? isHover?.left || 0 : 0;

    useEffect(() => {
        if (isHover && isHover.element === playingElement.current && playRef && speechSynthesis.speaking && !speechSynthesis.paused) {
            setIsPlaying(true);
        } else {
            setIsPlaying(false);
        }
    }, [isHover, playRef]);

    useEffect(() => {
        const mutation = new MutationObserver(() => {
            const elements = getTopLevelReadableElementsOnPage() || [];
            setAllElments(elements);
        });

        mutation.observe(document.body, { childList: true, subtree: true });

        const handleBeforeUnload = () => {
            if (speechSynthesis.speaking) {
                speechSynthesis.cancel();
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            mutation.disconnect();
            window.removeEventListener('beforeunload', handleBeforeUnload);
            if (speechSynthesis.speaking) {
                speechSynthesis.cancel();
            }
        };
    }, []);

    const handlePlayPauseClick = () => {
        if (!isHover) return;
        const element = isHover.element;
        if (element !== playingElement.current) {
            if (speechSynthesis.speaking) {
                speechSynthesis.cancel();
                setIsPlaying(false);
            }
            const newPlayRef = speech(element);
            playingElement.current = element;
            setPlayRef(newPlayRef);
            setIsPlaying(true);
        } else {
            if (speechSynthesis.speaking && !speechSynthesis.paused) {
                speechSynthesis.pause();
                setIsPlaying(false);
            } else if (speechSynthesis.paused) {
                speechSynthesis.resume();
                setIsPlaying(true);
            } else {
                const newPlayRef = speech(element);
                playingElement.current = element;
                setPlayRef(newPlayRef);
                setIsPlaying(true);
            }
        }
    };

    return (
        <div
            id="hover-player"
            hidden={!isHover}
            className="border-2 border-blue-500 p-1 rounded-full cursor-pointer bg-white dark:bg-black"
            onClick={handlePlayPauseClick}
            style={{
                position: "absolute",
                top: top,
                transform: "translate(-50%,-50%)",
                left: left,
                opacity: 0.9,
                zIndex: 1000,
            }}
        >
            {isPlaying ? (
                <PauseIcon
                    className="h-6 w-6"
                    hasGradient
                    stops={[
                        { color: `#b794f4`, offset: 0 },
                        { color: `#ed64a6`, offset: 50 },
                        { color: `#f56565`, offset: 100 },
                    ]}
                />
            ) : (
                <PlayIcon
                    className="h-6 w-6"
                    hasGradient
                    stops={[
                        { color: `#b794f4`, offset: 0 },
                        { color: `#ed64a6`, offset: 50 },
                        { color: `#f56565`, offset: 100 },
                    ]} />
            )
            }
        </div>
    );
};