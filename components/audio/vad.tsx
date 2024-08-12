"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { useMicVAD, utils } from "@ricky0123/vad-react";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import { UPLOAD_ROUTES } from "@/routes";
import AiLoader from "./ai-loader";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useSocket } from "../providers/socket-provider";


type LLMoptions = "assistant" | "completion";

const selectLLMOptions: { value: LLMoptions, label: string }[] = [
    { value: "assistant", label: "Assistant" },
    { value: "completion", label: "Completion" }
]

const VoiceAI = () => {
    const [llmType, setLLmType] = useState<LLMoptions>("completion");
    const [startConversation, setStartConversation] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const timeout = useRef<NodeJS.Timeout>();
    const [currentRecord, setCurrentRecord] = useState<Float32Array | null>(null);
    const [currentMessage, setCurrentMessage] = useState<any[]>([]);
    const speechRef = useRef<HTMLAudioElement>(null);
    const urlRef = useRef<string | null>(null);
    const { socket } = useSocket();


    const [AIprocessing, setAIprocessing] = useState(false);
    const [threadId, setThreadId] = useState<string | null>(null);

    const { start, pause, userSpeaking } = useMicVAD({
        startOnLoad: false,
        onSpeechStart: () => {
            console.log("start")
        },
        onSpeechEnd: async (audio) => {
            setCurrentRecord((prev) => {
                if (prev) {
                    return new Float32Array([...prev, ...new Float32Array(audio)]);
                }
                return new Float32Array(audio);
            });
            const isFirefox = navigator.userAgent.includes("Firefox");
            if (isFirefox) pause();
        },
        workletURL: "/vad.worklet.bundle.min.js",
        modelURL: "/silero_vad.onnx",
        positiveSpeechThreshold: 0.6,
        minSpeechFrames: 4,
        ortConfig(ort) {
            const isSafari = /^((?!chrome|android).)*safari/i.test(
                navigator.userAgent
            );
            ort.env.wasm = {
                wasmPaths: {
                    "ort-wasm-simd-threaded.wasm":
                        "/ort-wasm-simd-threaded.wasm",
                    "ort-wasm-simd.wasm": "/ort-wasm-simd.wasm",
                    "ort-wasm.wasm": "/ort-wasm.wasm",
                    "ort-wasm-threaded.wasm": "/ort-wasm-threaded.wasm",
                },
                numThreads: isSafari ? 1 : 4,
            };
        },
    });

    const toggleEnds = useCallback(() => {
        if (!!currentRecord) {
            pause();
            setAIprocessing(true);
            const wav = utils.encodeWAV(currentRecord as Float32Array);
            const blob = new Blob([wav], { type: "audio/wav" });
            const url = URL.createObjectURL(blob);
            urlRef.current = url;

            const form = new FormData();
            form.append("file", blob, `${uuidv4()}.wav`);
            form.append("messages", JSON.stringify(currentMessage));

            /*
                Voice Assistant ID - Hard Code! 
            */
            const thread = threadId ? `&threadId=${threadId}` : "";
            const query = `?llm=${llmType}` + (llmType === "assistant" ? `&assistantId=asst_pZwbRfwsxTOjfdBNr7NwD1rC` + thread : "");

            console.time("starting process");
            const res = axios.post(UPLOAD_ROUTES.uploadTranscriptMemory + query, form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "x-socket-id": socket.id,
                }
            }).then((response) => {
                if (response.data.threadId) {
                    setThreadId(response.data.threadId);
                }
                setCurrentMessage((prev) => [
                    ...prev,
                    { role: "user", content: response.data.humanTranscription },
                    { role: "assistant", content: response.data.assistantTranscription },
                ]);

                const playbackURL = `${UPLOAD_ROUTES.uploadTranscript}/generate-audio?text=${encodeURIComponent(response.data.assistantTranscription)}`;

                console.timeEnd("starting process");

                const request = fetch(playbackURL).then((res) => {
                    if (!speechRef.current) return;
                    speechRef.current.src = playbackURL;

                    speechRef.current.onended = () => {
                        console.log("Ending playing AI voice....");
                        toast.info("Your turn to speak...");
                        setAIprocessing(false);
                        start();
                    };

                    speechRef.current.oncanplaythrough = () => {
                        console.log("Audio is fully buffered and can play through....");
                        if (speechRef.current) {
                            speechRef.current.play().then(() => toast.info("AI speaking...")).catch((err) => {
                                toast.error("Sorry but, my voice is broken")
                                console.error("Error playing audio:", err)
                            });
                        }
                    };
                });
            }).catch((error) => {
                toast.error(<div className='dark:text-white'>{JSON.stringify(error)}</div>);
                console.error(error);
            });

            setCurrentRecord(null);
        }
    }, [currentRecord])

    useEffect(() => {
        if (userSpeaking) {
            setIsSpeaking(true);
            clearTimeout(timeout.current);
        } else if (isSpeaking) {
            timeout.current = setTimeout(() => {
                setIsSpeaking(false);
                toggleEnds();
            }, 2000);
        }
        return () => clearTimeout(timeout.current);
    }, [userSpeaking, toggleEnds]);

    useEffect(() => {
        if (startConversation) {
            start();
        } else {
            pause();
        }
    }, [startConversation]);

    return (
        <div>
            <audio hidden ref={speechRef} crossOrigin="anonymous"> </audio>
            <Select onValueChange={(s: LLMoptions) => setLLmType(s)} value={llmType}>
                <SelectTrigger className="w-[180px]" disabled={AIprocessing || isSpeaking}>
                    <SelectValue placeholder="Select Engine" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>LLMs</SelectLabel>
                        {selectLLMOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>

            <Button
                onClick={() => setStartConversation(!startConversation)}
            >
                {startConversation ? "pause conversation" : "start conversation"}
            </Button>

            <AiLoader thinking={AIprocessing} listening={isSpeaking} />
        </div>
    )
}


export default VoiceAI;