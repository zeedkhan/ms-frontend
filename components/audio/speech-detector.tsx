"use client";

declare global {
    interface Window {
        webkitSpeechRecognition: any;
        SpeechRecognition: any;
    }
}

import { useCallback, useEffect, useRef, useState } from 'react';

type SpeechDetectionOptions = {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
}

type SpeechDetectorProps = {
    allowMic: boolean;
    source: MediaStreamAudioDestinationNode | null;
    speechDetectionOptions: SpeechDetectionOptions;
    startConversation: boolean
    processing: boolean
};

const useSpeechDetector = ({
    allowMic,
    startConversation,
    source,
    speechDetectionOptions,
    processing
}: SpeechDetectorProps) => {

    const recognitionRef = useRef<any>(null);
    const [userSpeaking, setUserSpeaking] = useState(false);
    const [run, setRun] = useState(false);
    const [counter, setCounter] = useState(0);
    const micRef = useRef(allowMic);
    const startRef = useRef(startConversation);
    const processingRef = useRef(processing);

    useEffect(() => {
        if (counter) {
            const time = setTimeout(() => {
                setUserSpeaking(false)
                setCounter(0)
            }, 2000);

            return () => {
                clearTimeout(time);
            }
        }
    }, [counter]);

    const handleResult = useCallback((event: any) => {
        if (!micRef.current || !startRef.current || processingRef.current) {
            setUserSpeaking(false);
            return
        }

        if (event.results.length > 0) {
            const transcript = event.results[event.resultIndex][0].transcript.trim();
            if (transcript && !userSpeaking) {
                console.log("transcript", transcript)
                setUserSpeaking(true);
                setCounter((prev) => prev + 1)
            }
        }
    }, [userSpeaking, micRef, startRef, processingRef]);

    const onEndCallback = useCallback(() => {
        if (processingRef.current) {
            setUserSpeaking(false);
            return;
        }
        if (micRef.current && startRef.current) {
            setUserSpeaking(false);
            console.log("Allow mic and run")
            recognitionRef.current.start();
        }
    }, [micRef, startRef, processingRef]);


    const onStart = useCallback(() => {
        console.log("Trigger start");
        if (!allowMic) {
            console.log("Disable mic")
            recognitionRef.current.stop();
            return;
        }
    }, [allowMic])

    const onError = useCallback((event: any) => {
        if (processingRef.current) {
            return;
        }
        console.error('Speech recognition error', event.error);
        setUserSpeaking(false);
        if (micRef.current && run) {
            recognitionRef.current.stop();
        }
    }, [micRef, run, processingRef]);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;

            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = speechDetectionOptions.continuous;
            recognitionRef.current.interimResults = speechDetectionOptions.interimResults;
            recognitionRef.current.lang = speechDetectionOptions.lang;

            recognitionRef.current.onstart = () => onStart();

            recognitionRef.current.onabort = () => {
                setUserSpeaking(false);
            };

            // recognitionRef.current.onaudiostart = () => {
            //     console.log("source?.stream.getAudioTracks()", source);
            //     if (source) {
            //         const track = source.stream.getAudioTracks()[0];
            //         track.enabled = true
            //     }
            // };

            recognitionRef.current.onend = () => onEndCallback();

            recognitionRef.current.onresult = (event: any) => handleResult(event);

            recognitionRef.current.onspeechend = () => {
                console.log("User stopped speaking")
                setUserSpeaking(false);
                recognitionRef.current.stop();

                // recognitionRef.current.start();
            };

            recognitionRef.current.onabort = () => {
                console.log("Should abort")
            }

            recognitionRef.current.onerror = (event: any) => onError(event);
        } else {
            console.error('Speech recognition not supported in this browser');
        }
    }, [onStart, onEndCallback, handleResult, onError, source, speechDetectionOptions]);

    const start = () => {
        if (!run) {
            setRun(true)
        }
        if (recognitionRef.current && !userSpeaking && micRef.current) {
            recognitionRef.current.start();
        }
    };

    const stop = () => {
        if (recognitionRef.current) {
            setUserSpeaking(false);
            recognitionRef.current.stop();
            recognitionRef.current.abort();
        }
    };


    useEffect(() => {
        if (!startConversation) {
            stop();
        }
        startRef.current = startConversation;
    }, [startConversation])

    useEffect(() => {
        micRef.current = allowMic;
        if (!allowMic) {
            setUserSpeaking(false);
        }

    }, [allowMic]);

    useEffect(() => {
        if (processing) {
            setUserSpeaking(false);
            recognitionRef.current.stop();
        }
        processingRef.current = processing;
    }, [processing])

    return {
        startSpeechDetection: start,
        stopSpeechDetection: stop,
        userSpeaking,
    };
};

export default useSpeechDetector;