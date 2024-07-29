"use client";

import { isPointInsideElement, useHoveredParagraphCoordinate } from "@/hooks/use-mouse";
import { killSpeech, speech } from "@/lib/play";
import { useEffect, useRef, useState } from "react";
import { getTopLevelReadableElementsOnPage } from "@/lib/parser";
import PauseIcon from "../icon/pause-icon";
import PlayIcon from "../icon/play-icon";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";
import { AudioLines, Eraser } from 'lucide-react';
import AISpeechBox from "./ai-speech-box";

export default function HoverPlayer() {
    const [allElements, setAllElments] = useState<HTMLElement[]>([]);
    const hoverElement = useHoveredParagraphCoordinate(allElements as HTMLElement[]);
    const [playRef, setPlayRef] = useState<SpeechSynthesis | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const playingElement = useRef<HTMLElement | null>(null);
    const top = hoverElement ? hoverElement?.top || 0 : 0;
    const left = hoverElement ? hoverElement?.left || 0 : 0;
    const [showTools, setShowTools] = useState(false);

    const [playText, setPlayText] = useState<string | null>(null);

    useEffect(() => {
        if (hoverElement && hoverElement.element === playingElement.current && playRef && speechSynthesis.speaking && !speechSynthesis.paused) {
            setIsPlaying(true);
        } else {
            setShowTools(false);
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

    const killSpeechSynthesis = () => {
        killSpeech();
        setIsPlaying(false);
        setPlayRef(null);
        setPlayText(null);
        playingElement.current = null;
    }

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

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (!hoverElement?.element) return;
            const mouseCoordinate = { x: e.clientX, y: e.clientY };
            const clickInsideEl = isPointInsideElement(mouseCoordinate, hoverElement?.element);
            const isPointPlayBtn = isPointInsideElement(mouseCoordinate, document.getElementById("hover-player") as HTMLElement);
            const isPointPlayToolsElements = isPointInsideElement(mouseCoordinate, document.getElementById("hover-play-tools") as HTMLElement);
            if (!clickInsideEl) {
                setShowTools(false);
            }
            if (isPointPlayBtn || isPointPlayToolsElements) {
                setShowTools(true);
            };

        }
        window.addEventListener("click", handleClick);

        return () => {
            window.removeEventListener("click", handleClick)
        }
    }, [hoverElement])

    return (
        <>
            <DropdownMenu open={showTools}>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        hidden={!hoverElement}
                        id="hover-player"
                        onMouseEnter={() => {
                            setShowTools(true)
                        }}
                        onMouseLeave={() => setShowTools(false)}
                        className={cn(
                            `${!hoverElement && "hidden"}`,
                            `absolute w-8 h-8 bg-background border-2 border-blue-500 p-1 rounded-full cursor-pointer`)
                        }
                        onClick={handlePlayPauseClick}
                        style={{
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
                                ]}
                            />
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    id="hover-play-tools"
                    className="border-none bg-transparent shadow-none min-w-fit flex flex-col space-y-2 justify-evenly"
                    onMouseLeave={() => setShowTools(false)}
                    onMouseEnter={() => setShowTools(true)}>
                    <DropdownMenuItem className=" h-8">
                        <Button
                            onClick={() => {
                                setPlayText(hoverElement?.element ? hoverElement?.element.textContent : null);
                            }}
                            variant="outline"
                            size="icon"
                            className={cn(` w-8 h-8 bg-background border-2 border-blue-500 p-1 rounded-full cursor-pointer`)}
                        >
                            <AudioLines className="h-6 w-6" />
                        </Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem className=" h-8">
                        <Button
                            onClick={killSpeechSynthesis}
                            variant="outline"
                            size="icon"
                            className={cn(` w-8 h-8 bg-background border-2 border-blue-500 p-1 rounded-full cursor-pointer`)}
                        >
                            <Eraser className="h-6 w-6" />
                        </Button>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>


            {/* {playText && (
                <AISpeechBox text={playText} />
            )} */}

        </>
    );
};