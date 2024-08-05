import Markdown from '@/components/editor/markdown';
import React from 'react';

interface ParagraphProps {
    text: string;
}

const Paragraph: React.FC<ParagraphProps> = ({ text }) => {
    return (
        <div className='rounded-lg p-2'>
            <Markdown content={text} />
            {/* <Separator className="border-xl bg-gray-200 w-full h-[.5px] " /> */}
        </div>
    );
};

export default Paragraph;