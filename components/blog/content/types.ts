export type AttachesProps = {
    file: {
        url: string;
        name: string
        size: number;
        extension: string;
    }
    title: string;
}

export type ListProps = {
    items: string[];
    style: "unordered" | "ordered";
}

export type CheckListProps = {
    items: {
        text: string;
        checked: boolean;
    }[]
}

export type QuoteProps = {
    text: string;
    caption: string;
    alignment: "left" | "center" | "right";
}

export type TableBlockProps = {
    content: string[][];
    withHeadings: boolean;
}

export type ImageProps = {
    file: {
        url: string
    }
    caption: string;
    stretched: boolean;
    withBackground: boolean;
    withBorder: boolean;
}

export type MermaidProps = {
    code: string;
    caption: string;
}

export type EmbedProps = {
    embed: string;
    width: number;
    height: number;
    source: string
    caption: string;
    service: string;
}