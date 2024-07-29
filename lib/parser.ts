
const IGNORE_LIST = [
    "H1",
    "H2",
    "H3",
    "H4",
    "H5",
    "H6",
    "BUTTON",
    "LABEL",
    // "SPAN",
    "IMG",
    "SVG",
    "PRE",
    "SCRIPT",
    "TEXTAREA"
];


const isValidDom = (node: Element): boolean => {
    if (!node) return false;
    if (node.textContent?.trim().length === 0) return false;
    return (
        node &&
        !node.closest(IGNORE_LIST.join(",")) &&
        !IGNORE_LIST.includes(node.tagName.toUpperCase()) &&
        node.parentElement &&
        node.parentElement.children.length > 1 &&
        !node.querySelector(IGNORE_LIST.join(","))
    ) || false;
};


export function getTopLevelReadableElementsOnPage(): HTMLElement[] {
    const body = window && window.document && window.document.body || [];

    const findValidDom = () => {
        const childrens = [...Array.from(body.children)].filter((node) => !IGNORE_LIST.includes(node.tagName.toUpperCase()));
        const stack = [...childrens];
        const validDoms: Element[] = [];
        while (stack.length > 0) {
            const node = stack.shift();
            let isAdd = false;
            if (node && isValidDom(node)) {
                validDoms.push(node);
                isAdd = true;
            }

            if (!isAdd && node) {
                stack.unshift(...Array.from(node.children));
            }


        }
        return validDoms;
    };

    return Array.from(findValidDom()) as HTMLElement[];
}