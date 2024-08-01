"use client";

declare global {
    interface Window {
        webkitSpeechRecognition: any;
        SpeechRecognition: any;
    }
}

import { useCallback, useEffect, useRef, useState } from 'react';

type SpeechDetectorProps = {
    allowMic: boolean;

};

const useSpeechDetector = ({ allowMic }: SpeechDetectorProps) => {
    const recognitionRef = useRef<any>(null);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [run, setRun] = useState(false);
    const ourMic = useRef(allowMic)

    const handleResult = useCallback((event: any) => {
        if (!ourMic.current) {
            setIsSpeaking(false);
            return
        }

        if (event.results.length > 0) {
            const transcript = event.results[event.resultIndex][0].transcript.trim();
            if (transcript && !isSpeaking) {
                console.log("transcript", transcript)
                setIsSpeaking(true);
            }
        }
    }, [isSpeaking, ourMic]);

    const onEndCallback = useCallback(() => {
        if (run && ourMic.current) {
            setIsSpeaking(false);
            console.log("Allow mic and run")
            recognitionRef.current.start();
        }
    }, [run, ourMic]);


    const onStart = useCallback(() => {
        if (!allowMic) {
            recognitionRef.current.stop();
            return;
        }
        console.log('Speech recognition service has started');
        setRun(true);
    }, [])

    const onError = useCallback((event: any) => {
        console.error('Speech recognition error', event.error);
        setIsSpeaking(false);
        if (ourMic.current && run) {
            recognitionRef.current.start();
        }
    }, [ourMic, run]);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;

            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onstart = () => onStart();

            recognitionRef.current.onabort = () => {
                setIsSpeaking(false);
            }

            recognitionRef.current.onend = () => onEndCallback();

            recognitionRef.current.onresult = (event: any) => handleResult(event);

            recognitionRef.current.onspeechend = () => {
                setIsSpeaking(false);
                console.log('User stopped speaking');
            };

            recognitionRef.current.onabort = () => {
                console.log("Should abort")
            }

            recognitionRef.current.onerror = (event: any) => onError(event);
        } else {
            console.error('Speech recognition not supported in this browser');
        }
    }, [onStart, onEndCallback, handleResult, onError]);

    const start = () => {
        if (!run) {
            setRun(true)
        }
        if (recognitionRef.current && !isSpeaking && ourMic.current) {
            recognitionRef.current.start();
        }
    };

    const stop = () => {
        if (recognitionRef.current) {
            setIsSpeaking(false);
            recognitionRef.current.stop();
            recognitionRef.current.abort();
        }
    };

    useEffect(() => {
        ourMic.current = allowMic
    }, [allowMic]);

    return {
        startSpeechDetection: start,
        stopSpeechDetection: stop,
        isSpeaking,
    };
};

export default useSpeechDetector;
