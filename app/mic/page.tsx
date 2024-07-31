import { AudioRecorderWithVisualizer } from "@/components/audio-record";
import SpeechDetector from "@/components/audio/speech-detector";

export default function Page() {


    return (
        <div>
            <h1>Micro Frontend Page</h1>

            <p>
                This is a micro frontend page.
            </p>
            {/* <SpeechDetector /> */}
            <AudioRecorderWithVisualizer />
        </div>
    )
}