"use client";

import { useEffect, useRef, useState } from "react";

const useAudio = () => {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const audio = useRef<HTMLAudioElement | null>(typeof window !== 'undefined' ? document.createElement('audio') : null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
            setStream(stream);
            if (audio.current) {
                audio.current.srcObject = stream;
                audio.current.onloadedmetadata = (e) => {
                    setLoading(false);
                    audio.current?.play();
                };
            }
        }).catch((err) => setError(err.message));
    }, []);


    return { stream, audio, loading, error };
}


export default useAudio;