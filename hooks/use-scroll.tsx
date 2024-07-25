import { useEffect, useState } from "react";

const useScroll = () => {
    const [scrollTop, setScrollTop] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollTop(window.scrollY);
        }
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, [])

    return {
        scrollTop: scrollTop,
    };
}

export default useScroll;