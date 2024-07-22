import { useCallback, useEffect, useState } from "react";

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
    parsedElements: HTMLElement[],
): HoveredElementInfo | null {

    const [hoveredElement, setHoveredElement] = useState<HoveredElementInfo | null>(null);

    const callback = useCallback(() => {
        const onMouseMove = (event: MouseEvent) => {
            const coordinates = { x: event.clientX, y: event.clientY };
            const hoveredElement = parsedElements.find((element) => isPointInsideElement(coordinates, element));
            const isPointPlayBtn = isPointInsideElement(coordinates, document.getElementById("hover-player") as HTMLElement);
            if (isPointPlayBtn) {
                return;
            }
            if (hoveredElement) {
                const { top, left } = getElementBounds(hoveredElement);
                const heightOfFirstLine = getLineHeightOfFirstLine(hoveredElement);
                setHoveredElement({ element: hoveredElement, top, left, heightOfFirstLine });
            } else {
                setHoveredElement(null);
            }
        };

        window.addEventListener('mousemove', onMouseMove);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
        };
    }, [parsedElements]);


    useEffect(() => {
        callback();
    }, [parsedElements, callback]);

    return hoveredElement;
}
