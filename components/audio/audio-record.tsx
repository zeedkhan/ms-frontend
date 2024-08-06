"use client";

import React, { useState, useRef, useEffect } from 'react';
import { cn, downloadBlob } from '@/lib/utils';
import { Download, Mic, MicOff, Trash } from 'lucide-react';
import useSpeechDetector from './speech-detector';

type Props = {
    className?: string;
};

type Record = {
    id: number;
    name: string;
    file: string | null;
};


type SpeechDetectionOptions = {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
}

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { EnhanceButton } from '../ui/enhance-button';
import { toast } from 'sonner';
import { uploadFile } from '@/db/upload';
import { UPLOAD_ROUTES } from '@/routes';
import axios from 'axios';
import AiLoader from './ai-loader';


const language = [
    {
        value: "th-TH",
        label: "Thai",
    },
    {
        value: "en-US",
        label: "English",
    },
    {
        value: "zh-CN",
        label: "Chinese",
    },
    {
        value: "zh-HK",
        label: "Cantonese",
    }
];


type Controller = {
    stream: MediaStream | null;
    mediaRecorder: MediaRecorder | null;
    audioContext: AudioContext | null;
    destination: MediaStreamAudioDestinationNode | null;
};

export const AudioRecorderWithVisualizer = ({ className }: Props) => {
    const [currentRecord, setCurrentRecord] = useState<Record>({
        id: -1,
        name: "",
        file: null,
    });

    const [allowMic, setAllowMic] = useState(true);
    const recorderChunks = useRef<Blob[]>([]);
    const [mediaRecorder, setMediaRecorder] = useState<Controller | null>(null);
    const [options, setOptions] = useState<SpeechDetectionOptions>({
        continuous: true,
        interimResults: true,
        lang: "en-US",
    });
    const [processing, setProcessing] = useState(false);
    const [startConversation, setStartConversation] = useState(false);

    const handleChangeLanguage = (e: string) => {
        setOptions((prev) => ({ ...prev, lang: e }))
    };

    const [currentMessage, setCurrentMessage] = useState<any[]>([]);

    const {
        startSpeechDetection,
        stopSpeechDetection,
        userSpeaking: isSpeaking,
    } = useSpeechDetector({
        allowMic,
        source: mediaRecorder?.destination as MediaStreamAudioDestinationNode,
        speechDetectionOptions: options,
        startConversation: startConversation,
        processing: processing
    });

    async function startRecording() {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    sampleRate: 48000,
                    channelCount: 0,
                    autoGainControl: true,
                    echoCancellation: false,
                    noiseSuppression: true,
                },
            });

            const AudioContext = window.AudioContext;
            const audioCtx = new AudioContext();

            const mimeType = MediaRecorder.isTypeSupported("audio/mpeg") ? "audio/mpeg"
                : MediaRecorder.isTypeSupported("audio/webm")
                    ? "audio/webm"
                    : "";
            const options = { mimeType };

            // record audio
            const mediaRecorder = new MediaRecorder(stream, options);
            const destination = audioCtx.createMediaStreamDestination();

            mediaRecorder.onstart = () => {
                recorderChunks.current = [];
            }
            mediaRecorder.ondataavailable = (e) => {
                recorderChunks.current.push(e.data);
            };

            mediaRecorder.onstop = async () => {
                // stopSpeechDetection();
                // setProcessing(true);
                const recordBlob = new Blob(recorderChunks.current, { type: "audio/wav" });
                if (recordBlob.size > 0) {
                    console.log("recordingChunks", recorderChunks.current);
                    setCurrentRecord({
                        ...currentRecord,
                        file: window.URL.createObjectURL(recordBlob),
                    });

                    const response = await uploadFile(new File([recordBlob], `mic/test.wav`), "conversation");
                    // console.log(response);
                    if (response.error) {
                        toast.error(<div className='dark:text-white'>{JSON.stringify(response)}</div>);
                        console.error(response);
                    }

                    if (response.storePath) {
                        toast.success(<div className='dark:text-white'>{JSON.stringify(response)}</div>);
                        console.log(response.success);
                        await testSpeech(response.storePath);
                    }
                }
                // setProcessing(false);
            };

            mediaRecorder.start();

            setMediaRecorder({
                stream,
                mediaRecorder,
                audioContext: audioCtx,
                destination,
            })
        }
    }

    async function stopRecording() {
        if (mediaRecorder?.mediaRecorder) {
            stopSpeechDetection();
            mediaRecorder.mediaRecorder.stop();
        }
    }

    const handleMic = () => {
        setAllowMic(!allowMic);
        if (!allowMic) {
            stopSpeechDetection();
            setStartConversation(false);
        } else {
            if (startConversation) {
                startSpeechDetection();
                setStartConversation(true);
                if (mediaRecorder?.mediaRecorder) {
                    mediaRecorder.mediaRecorder.start();
                }
            }
        }
    };

    const handleStart = () => {
        if (!allowMic) {
            toast.error("Please enable microphone to start recording");
            return;
        }
        if (startConversation) {
            stopRecording();
            stopSpeechDetection();
            setStartConversation(false);
            return;
        }
        startRecording();
        startSpeechDetection();
        setStartConversation(!startConversation);
    };

    const speechRef = useRef<HTMLAudioElement>(null);

    const testSpeech = async (filePath: string) => {
        if (!speechRef.current) return;
        setProcessing(true);
        const url = `${UPLOAD_ROUTES.uploadTranscript}/transcribe-and-completeion`;

        const response = await axios.post(url, { filePath, messages: currentMessage });

        const playbackURL = `${UPLOAD_ROUTES.uploadTranscript}/generate-audio?text=${encodeURIComponent(response.data.assistantTranscription)}`;
        const request = await fetch(playbackURL);

        setCurrentMessage((prev) => [
            ...prev,
            { role: "user", content: response.data.humanTranscription },
            { role: "assistant", content: response.data.assistantTranscription },
        ]);

        speechRef.current.src = playbackURL;

        speechRef.current.onended = () => {
            console.log("Ending playing AI voice....");
            toast.info("Your turn to speak...")
            setProcessing(false);
        };

        speechRef.current.oncanplaythrough = () => {
            console.log("Audio is fully buffered and can play through....");
            if (speechRef.current) {
                speechRef.current.play().then(() => toast.info("AI speaking...")).catch((err) => {
                    toast.error("Sorry but, my voice is broken")
                    console.error("Error playing audio:", err)
                });
            }
            setProcessing(true);
        };
    };

    useEffect(() => {
        if (!isSpeaking && mediaRecorder?.mediaRecorder) {
            mediaRecorder.mediaRecorder.stop();
            mediaRecorder.mediaRecorder.start();
        }
    }, [isSpeaking, mediaRecorder, startConversation]);

    return (
        <div className={cn("flex h-16 rounded-md relative w-full items-center justify-center gap-2 max-w-5xl", "border-none p-0", className)}>
            {/* display the record audio */}
            <audio ref={speechRef} crossOrigin="anonymous"> </audio>
            <EnhanceButton>
                Start Speech Testing
            </EnhanceButton>
            <div className="flex gap-2">
                <EnhanceButton
                    disabled={startConversation || processing}
                    onClick={handleMic}
                    size={"icon"}
                    variant={"ringHover"}
                >
                    {allowMic ? <Mic size={15} /> : <MicOff size={15} />}
                </EnhanceButton>
                <Select onValueChange={handleChangeLanguage} defaultValue={options.lang}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Languages</SelectLabel>
                            {language.map((lang) => (
                                <SelectItem key={lang.value} value={lang.value}>
                                    {lang.label}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <EnhanceButton
                    disabled={!allowMic || processing}
                    variant={"ringHover"}
                    onClick={handleStart}
                >
                    {startConversation ? "Stop Conversation" : "Start Conversation"}
                </EnhanceButton>
            </div>
            <AiLoader thinking={processing} listening={isSpeaking} />
        </div>
    );
};