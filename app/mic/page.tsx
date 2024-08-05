import { AudioRecorderWithVisualizer } from "@/components/audio/audio-record";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Development - Mic",
};

export default function Page() {
    return (
        <div>
            <AudioRecorderWithVisualizer />
        </div>
    )
}