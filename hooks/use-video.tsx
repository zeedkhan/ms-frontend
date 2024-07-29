"use client";

import { useEffect, useRef, useState } from "react";

const useVideo = (audio: boolean = true) => {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const video = useRef<HTMLVideoElement | null>(typeof window !== 'undefined' ? document.createElement('video') : null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: audio }).then((stream) => {
            setStream(stream);
            if (video.current) {
                video.current.srcObject = stream;
                video.current.onloadedmetadata = (e) => {
                    setLoading(false);

                    video.current?.play();
                };
            }
        }).catch((err) => setError(err.message));
    }, []);


    return { stream, video, loading, error };
}


export default useVideo;