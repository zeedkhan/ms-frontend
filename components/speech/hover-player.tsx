"use client";

import { useHoveredParagraphCoordinate } from "@/hooks/use-mouse";
import { speech } from "@/lib/play";
import { useEffect, useRef, useState } from "react";
import { getTopLevelReadableElementsOnPage } from "@/lib/parser";
import PauseIcon from "../icon/pause-icon";
import PlayIcon from "../icon/play-icon";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuSubContent, DropdownMenuTrigger } from "../ui/dropdown-menu";


export default function HoverPlayer() {
    const [allElements, setAllElments] = useState<HTMLElement[]>([]);
    const hoverElement = useHoveredParagraphCoordinate(allElements as HTMLElement[]);
    const [playRef, setPlayRef] = useState<SpeechSynthesis | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const playingElement = useRef<HTMLElement | null>(null);
    const top = hoverElement ? hoverElement?.top || 0 : 0;
    const left = hoverElement ? hoverElement?.left || 0 : 0;

    useEffect(() => {
        if (hoverElement && hoverElement.element === playingElement.current && playRef && speechSynthesis.speaking && !speechSynthesis.paused) {
            setIsPlaying(true);
        } else {
            setIsPlaying(false);
        }
    }, [hoverElement, playRef]);

    /* 
    * This is the function that will be called when the component is mounted
    * It will create a mutation observer to observe the body of the document
    * It will also add an event listener to the window to handle the beforeunload event
    */
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
        if (!hoverElement) return;
        const element = hoverElement.element;
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

    if (!hoverElement) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    id="hover-player"
                    hidden={!hoverElement}
                    className="absolute w-8 h-8 bg-background border-2 border-blue-500 p-1 rounded-full cursor-pointer"
                    onClick={handlePlayPauseClick}
                    style={{
                        top: top,
                        transform: "translate(-50%,-50%)",
                        left: left,
                        opacity: 0.9,
                        zIndex: 1000,
                    }}    >
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
                            className="h-6 w-6 rotate-90 scale-0 transition-transform ease-in-out duration-500 dark:rotate-0 dark:scale-100"
                            hasGradient
                            stops={[
                                { color: `#b794f4`, offset: 0 },
                                { color: `#ed64a6`, offset: 50 },
                                { color: `#f56565`, offset: 100 },
                            ]}
                        />
                    )}
                </Button>
            </DropdownMenuTrigger>
            {/* <DropdownMenuSubContent className="w-40">
                    asdasdasd
            </DropdownMenuSubContent> */}
        </DropdownMenu>
    );
};