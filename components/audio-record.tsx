"use client";

import React, { useState, useRef, useEffect } from 'react';
import useSpeechDetector from './audio/speech-detector';
import { cn, downloadBlob } from '@/lib/utils';
import { Button } from './ui/button';
import { Download, Mic, MicOff, Trash } from 'lucide-react';
import { motion } from "framer-motion"
type Props = {
    className?: string;
};

type Record = {
    id: number;
    name: string;
    file: string | null;
};


export const AudioRecorderWithVisualizer = ({ className }: Props) => {
    const [currentRecord, setCurrentRecord] = useState<Record>({
        id: -1,
        name: "",
        file: null,
    });

    const [allowMic, setAllowMic] = useState(true);

    const { startSpeechDetection, stopSpeechDetection, isSpeaking } = useSpeechDetector({
        onStartSpeaking: () => console.log('User started speaking'),
        onStopSpeaking: () => console.log('User stopped speaking'),
    });

    const recorder = useRef<MediaRecorder | null>(null);
    const recordingChunks = useRef<BlobPart[]>([]);

    const mediaRecorderRef = useRef<{
        stream: MediaStream | null;
        analyser: AnalyserNode | null;
        mediaRecorder: MediaRecorder | null;
        audioContext: AudioContext | null;
    }>({
        stream: null,
        analyser: null,
        mediaRecorder: null,
        audioContext: null,
    });

    function startRecording() {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices
                .getUserMedia({
                    audio: true,
                })
                .then((stream) => {
                    startSpeechDetection();

                    const AudioContext = window.AudioContext;
                    const audioCtx = new AudioContext();
                    const analyser = audioCtx.createAnalyser();
                    const source = audioCtx.createMediaStreamSource(stream);
                    source.connect(analyser);
                    mediaRecorderRef.current = {
                        stream,
                        analyser,
                        mediaRecorder: null,
                        audioContext: audioCtx,
                    };

                    const mimeType = MediaRecorder.isTypeSupported("audio/mpeg")
                        ? "audio/mpeg"
                        : MediaRecorder.isTypeSupported("audio/webm")
                            ? "audio/webm"
                            : "audio/wav";

                    const options = { mimeType };
                    mediaRecorderRef.current.mediaRecorder = new MediaRecorder(stream, options);
                    mediaRecorderRef.current.mediaRecorder.start();
                    recordingChunks.current = [];
                    recorder.current = new MediaRecorder(stream);
                    recorder.current.start();
                    recorder.current.ondataavailable = (e) => {
                        recordingChunks.current.push(e.data);
                    };
                })
                .catch((error) => {
                    alert(error);
                    console.log(error);
                });
        }
    }

    function stopRecording() {
        if (recorder.current) {
            recorder.current.onstop = () => {
                const recordBlob = new Blob(recordingChunks.current, { type: "audio/wav" });

                setCurrentRecord({
                    ...currentRecord,
                    file: window.URL.createObjectURL(recordBlob),
                });
                recordingChunks.current = [];
            };
            recorder.current.stop();
        }
        stopSpeechDetection();
    }

    function resetRecording() {
        const { mediaRecorder, stream, analyser, audioContext } = mediaRecorderRef.current;

        if (mediaRecorder) {
            mediaRecorder.onstop = () => {
                recordingChunks.current = [];
            };
            mediaRecorder.stop();
        } else {
            alert("recorder instance is null!");
        }

        if (analyser) {
            analyser.disconnect();
        }
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
        }
        if (audioContext) {
            audioContext.close();
        }
    }

    const handleSubmit = () => {
        stopRecording();
        if (currentRecord.file) {
            const downloadLink = document.createElement("a");
            downloadLink.href = currentRecord.file;
            downloadLink.download = `Audio_${new Date().getMilliseconds()}.mp3`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    };

    useEffect(() => {
        if (!allowMic) {
            stopRecording();
        } else {
            startRecording()
        }
    }, [allowMic]);

    return (
        <div className={cn("flex h-16 rounded-md relative w-full items-center justify-center gap-2 max-w-5xl", "border-none p-0", className)}>
            <div className="flex gap-2">
                <Button onClick={resetRecording} size={"icon"} variant={"destructive"}>
                    <Trash size={15} />
                    <span> Reset recording</span>
                </Button>

                <Button onClick={() => setAllowMic(!allowMic)} size={"icon"}>
                    {allowMic ? <Mic size={15} /> : <MicOff size={15} />}
                </Button>

                <Button onClick={handleSubmit} size={"icon"}>
                    <Download size={15} />
                </Button>

                {isSpeaking && (
                    <motion.div
                        className="bg-blue-500 rounded-full h-24 w-24 absolute top-1/2 right-1/2"
                        animate={{
                            scale: [1, 2, 2, 1, 1],
                            rotate: [0, 0, 180, 180, 0],
                            borderRadius: ["0%", "0%", "50%", "50%", "0%"]
                        }}
                        transition={{
                            duration: 2,
                            ease: "easeInOut",
                            times: [0, 0.2, 0.5, 0.8, 1],
                            repeat: Infinity,
                            repeatDelay: 1
                        }}
                    />
                )}
            </div>
        </div>
    );
};
