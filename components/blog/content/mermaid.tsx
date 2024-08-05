"use client";

import { Card, CardContent, CardHeader } from '@/components/ui/card';
// @ts-ignore
import { Mermaid } from 'mdx-mermaid/Mermaid';

type ListCompoenentProps = {
    code: string;
    caption: string;
}

const MermaidComponent: React.FC<ListCompoenentProps> = ({ code, caption }) => {
    return (
        <Card className='bg-white text-black'>
            <CardHeader className='text-center font-semibold'>
                {caption}
            </CardHeader>
            <CardContent>
                <Mermaid chart={code} />
            </CardContent>
        </Card>
    )
};


export default MermaidComponent;