import { useCallback, useEffect, useState } from "react";
import useScroll from "./use-scroll";

export function getElementBounds(elem: HTMLElement) {
    const bounds = elem.getBoundingClientRect();
    const top = bounds.top + window.scrollY;
    const left = bounds.left + window.scrollX;

    return {
        x: left,
        y: top,
        top,
        left,
        width: bounds.width,
        height: bounds.height,
    };
}

export function isPointInsideElement(
    coordinate: { x: number; y: number },
    element: HTMLElement
): boolean {
    if (element && element.contains(document.elementFromPoint(coordinate.x, coordinate.y))) {
        return true;
    }
    return false
}

export function getLineHeightOfFirstLine(element: HTMLElement): number {
    const computedStyle = window.getComputedStyle(element);
    return Number(computedStyle.lineHeight.replace('px', ''));
};


export type HoveredElementInfo = {
    element: HTMLElement;
    top: number;
    left: number;
    heightOfFirstLine: number;
};

export function useHoveredParagraphCoordinate(
    parsedElements: HTMLElement[]
): HoveredElementInfo | null {

    const [hoveredElement, setHoveredElement] = useState<HoveredElementInfo | null>(null);
    const mouseCoordinate = useMousePosition();
    const { scrollTop } = useScroll();

    const callback = useCallback(() => {
        if (speechSynthesis.speaking && !speechSynthesis.paused) return;
        const hoveredElement = parsedElements.find((element) => isPointInsideElement(mouseCoordinate, element));
        const isPointPlayBtn = isPointInsideElement(mouseCoordinate, document.getElementById("hover-player") as HTMLElement);
        const isPointPlayToolsElements = isPointInsideElement(mouseCoordinate, document.getElementById("hover-play-tools") as HTMLElement);
        if (isPointPlayBtn || isPointPlayToolsElements) {
            return;
        }
        if (hoveredElement) {
            const { top, left } = getElementBounds(hoveredElement);
            const heightOfFirstLine = getLineHeightOfFirstLine(hoveredElement);
            setHoveredElement({ element: hoveredElement, top, left, heightOfFirstLine });
        } else {
            setHoveredElement(null);
        }
    }, [parsedElements, mouseCoordinate])

    useEffect(() => {
        const time = setTimeout(() => {callback()}, 50);
        return () => {
            clearTimeout(time);
        };
    }, [parsedElements, mouseCoordinate, callback, scrollTop]);

    return hoveredElement;
}

const useMousePosition = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    
    useEffect(() => {
        const updateMousePosition = (ev: MouseEvent) => {
            setMousePosition({ x: ev.clientX, y: ev.clientY });
        };

        window.addEventListener('mousemove', updateMousePosition);

        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
        };
    }, []);

    return mousePosition;
};