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
        micRef.current = allowMic;
    }, [allowMic]);

    useEffect(() => {
        startRef.current = startConversation;
    }, [startConversation]);

    useEffect(() => {
        if (counter) {
            const time = setTimeout(() => {
                setUserSpeaking(false);
                setCounter(0);
            }, 2000);

            return () => {
                clearTimeout(time);
            };
        }
    }, [counter]);

    const handleResult = useCallback((event: any) => {
        if (!startRef.current) {
            setUserSpeaking(false);
            return;
        }

        if (event.results.length > 0) {
            const transcript = event.results[event.resultIndex][0].transcript.trim();
            if (transcript && !userSpeaking && !processingRef.current) {
                console.log("ProcessingRef", processingRef.current)
                console.log("transcript", transcript);
                setUserSpeaking(true);
                setCounter((prev) => prev + 1);
            }
        }
    }, [userSpeaking]);

    const onEndCallback = useCallback(() => {
        if (processingRef.current) {
            setUserSpeaking(false);
            return;
        }
        if (startRef.current) {
            setUserSpeaking(false);
            recognitionRef.current.start();
        }
    }, []);

    const onStart = useCallback(() => {
        // if (!allowMic) {
        //     recognitionRef.current.stop();
        //     return;
        // }
    }, []);

    const onError = useCallback((event: any) => {
        if (processingRef.current) {
            return;
        }
        setUserSpeaking(false);
        if (run) {
            recognitionRef.current.stop();
        }
    }, [run]);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;

            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = speechDetectionOptions.continuous;
            recognitionRef.current.interimResults = speechDetectionOptions.interimResults;
            recognitionRef.current.lang = speechDetectionOptions.lang;

            recognitionRef.current.onstart = () => onStart();

            recognitionRef.current.onabort = () => setUserSpeaking(false);

            recognitionRef.current.onend = () => onEndCallback();

            recognitionRef.current.onresult = (event: any) => handleResult(event);

            recognitionRef.current.onspeechend = () => {
                console.log("user stop speaking....")
                setUserSpeaking(false);
                recognitionRef.current.stop();
            };

            recognitionRef.current.onerror = (event: any) => onError(event);
        } else {
            console.error('Speech recognition not supported in this browser');
        }
    }, [onStart, onEndCallback, handleResult, onError, speechDetectionOptions]);

    const start = () => {
        if (!run) {
            setRun(true);
        }
        if (recognitionRef.current && !userSpeaking) {
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
    }, [startConversation]);

    useEffect(() => {
        if (processing) {
            stop();
            console.log("It should stop the vad")
        }
        processingRef.current = processing;
    }, [processing]);


    return {
        startSpeechDetection: start,
        stopSpeechDetection: stop,
        userSpeaking,
    };
};

export default useSpeechDetector;