import { useEffect, useState } from "react";

const UseWindowSize = () => {

    const [windowSize, setWindowSize] = useState<{
        width: number;
        height: number;
    } | null>(null);

    const [device, setDevice] = useState<"mobile" | "tablet" | "desktop" | null>(null);


    useEffect(() => {
        const checkDevice = () => {
            if (window.matchMedia("(max-width: 640px)").matches) {
                setDevice("mobile")
            } else if (window.matchMedia("(min-width: 641px) and (max-width: 1024px)").matches) {
                setDevice("tablet")
            } else {
                setDevice("desktop")
            }
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        }

        checkDevice();

        window.addEventListener("resize", checkDevice);

        return () => {
            window.removeEventListener("resize", checkDevice);
        }

    }, []);


    return {
        device,
        width: windowSize?.width,
        height: windowSize?.height,
        isMobile: device === "mobile",
        isTablet: device === "tablet",
        isDesktop: device === "desktop"
    };
}

export default UseWindowSize;