"use client";

declare global {
    interface Window {
        webkitSpeechRecognition: any;
        SpeechRecognition: any;
    }
}

import React, { useEffect, useRef, useState } from 'react';

type SpeechDetectorProps = {
    onStartSpeaking?: () => void;
    onStopSpeaking?: () => void;
};

const useSpeechDetector = ({ onStartSpeaking, onStopSpeaking }: SpeechDetectorProps) => {
    const recognitionRef = useRef<any>(null);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [start, setStart] = useState(false);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
            
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onstart = () => {
                console.log('Speech recognition service has started');
            };

            recognitionRef.current.onend = () => {
                console.log('Speech recognition service disconnected');
                setIsSpeaking(false);
                if (start) {
                    recognitionRef.current.start();
                }
            };

            recognitionRef.current.onresult = (event: any) => {
                if (event.results.length > 0) {
                    const transcript = event.results[event.resultIndex][0].transcript.trim();
                    if (transcript && !isSpeaking) {
                        console.log(transcript)
                        setIsSpeaking(true);
                        onStartSpeaking && onStartSpeaking();
                    }
                } 
            };

            recognitionRef.current.onspeechend = () => {
                setIsSpeaking(false);
                onStopSpeaking && onStopSpeaking();
                console.log('User stopped speaking');
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error('Speech recognition error', event.error);
                setIsSpeaking(false);
                if (start) {
                    recognitionRef.current.start();
                }
            };
        } else {
            console.error('Speech recognition not supported in this browser');
        }
    }, [start, onStartSpeaking, onStopSpeaking]);

    const startRecording = () => {
        if (!start) {
            setStart(true);
        }
        if (recognitionRef.current && recognitionRef.current.state !== 'active') {
            recognitionRef.current.start();
        }
    };

    const stopRecording = () => {
        console.log("Pause recording")
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setStart(false);
    };


    return {
        startSpeechDetection: startRecording,
        stopSpeechDetection: stopRecording,
        isSpeaking,
    };
};

export default useSpeechDetector;
