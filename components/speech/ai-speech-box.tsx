"use client";

import { motion } from "framer-motion";
import { CircleX } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import axios from "axios";
import { useSession } from "next-auth/react";
import { google } from "@google-cloud/text-to-speech/build/protos/protos";
import { SelectAIVoices } from "./select-voices";
import { cn } from "@/lib/utils";

const variants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, y: "-100%" },
}



import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function SelectDemo() {
    return (
        <Select>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Fruits</SelectLabel>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="blueberry">Blueberry</SelectItem>
                    <SelectItem value="grapes">Grapes</SelectItem>
                    <SelectItem value="pineapple">Pineapple</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

const AISpeechBox = ({ text }: { text: string }) => {
    const [show, setShow] = useState(true);
    const session = useSession();
    const [voices, setVoices] = useState(new Map<string, google.cloud.texttospeech.v1.IVoice[]>());

    useEffect(() => {
        const getVoices = async () => {
            try {
                const response = await axios.get<{ voices: google.cloud.texttospeech.v1.IListVoicesResponse['voices'] }>(process.env.NEXT_PUBLIC_DOMAIN + "/api/ai/speech");
                if (response.data.voices) {
                    response.data.voices.forEach((l) => {
                        if (l.languageCodes) {
                            l.languageCodes.forEach((code) => {
                                setVoices((v) => v.set(code, v.get(code) ? [...v.get(code)!, l] : [l]));
                            });
                        }
                        console.log(voices)
                    })
                }
            } catch (error) {
                console.error(error);
            }
        }
        getVoices();
    }, []);

    useEffect(() => {
        setShow(true);
    }, [text]);

    return (
        <motion.div
            variants={variants}
            animate={show ? "open" : "closed"}
        >
            <Card
                className={cn(
                    show ? "fixed right-1/2 translate-x-1/2 min-h-20 p-4 max-h-[50vh] bottom-4 flex flex-col w-full   rounded-lg shadow-md max-w-lg z-50" : "hidden",
                )}>
                <CardHeader>
                    <h1 className="text-lg font-bold">AI</h1>
                </CardHeader>
                <CardContent>
                    <CircleX onClick={() => {
                        setShow(false)

                    }} className="absolute top-0 right-0 mr-8 mt-8 cursor-pointer" />
                    <p className="text-sm">{text}</p>

                </CardContent>

                <select name="" id="" className="border rounded p-2 text-sm">
                    {Array.from(voices.keys()).map((code) => (
                        <optgroup label={code} key={code}>
                            {voices.get(code)?.map((voice) => (
                                <option value={voice.name || ""} key={voice.name}>{voice.name}</option>
                            ))}
                        </optgroup>
                    ))}
                </select>
            </Card>
        </motion.div>
    )
};



export default AISpeechBox;