import Content from "./_components/content";
import type { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'Background Removal',
  description: 'Fully privacy-focused background removal tool in your browser',
}

export default function Page() {
    return (
        <Content />
    );
}