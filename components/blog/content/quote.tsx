import { OutputBlockData } from '@editorjs/editorjs';
import React from 'react';
import { QuoteProps } from './types';

interface QuoteComponentProps {
    block: OutputBlockData<string, QuoteProps>;
}

const Quote: React.FC<QuoteComponentProps> = ({ block }) => {
    return (
        <div className="quote flex flex-col space-y-3 shadow rounded-xl p-4 border border-gray-200">
            <blockquote>{block.data.text}</blockquote>
            {block.data.caption && <cite>{block.data.caption}</cite>}
        </div>
    );
};

export default Quote;