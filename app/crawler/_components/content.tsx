"use client";

import { EnhanceButton } from "@/components/ui/enhance-button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { CircleCheckBig, CircleX } from "lucide-react";
import axios from "axios";
import { UPLOAD_ROUTES } from "@/routes";
import { useDebounce } from "use-debounce";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"


const formSchema = z.object({
    url: z.string().url({
        message: "Invalid url",
    }),
});

type InfoType = {
    cms: {
        possible_cms: string[],
        analytics_tools: string[],
        cms: string,
        description: string,
    }
}

function isValidHttpUrl(string: string) {
    try {
        const newUrl = new URL(string);
        return newUrl.protocol === 'http:' || newUrl.protocol === 'https:';
    } catch (err) {
        return false;
    }
};

const fetchMetadata = async (url: string) => {
    try {
        const response = await fetch("/api/crawl/og", {
            method: "POST",
            body: JSON.stringify({ url: url.trim() }),
            headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*",
            }
        });
        const data = await response.json();
        // Parse the HTML to extract Open Graph tags
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.data, 'text/html');
        const title = doc.querySelector('meta[property="og:title"]')?.getAttribute("content") || '';
        const description = doc.querySelector('meta[property="og:description"]')?.getAttribute("content") || '';
        const image = doc.querySelector('meta[property="og:image"]')?.getAttribute("content") || '';
        return { title, description, image };
    } catch (error) {
        console.error('Error fetching metadata:', error);
        return { title: "", description: "", image: "" };
    }
};

export default function Content() {
    const [loading, setLoading] = useState<boolean>(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            url: "",
        },
    });
    const url = form.watch("url");
    const [previewLink] = useDebounce(url, 1000);
    const [screenshot, setScreenshot] = useState<string | null>(null);
    const [metadata, setMetadata] = useState({ title: '', description: '', image: '' });
    const [info, setInfo] = useState<InfoType | null>(null);

    useEffect(() => {
        if (!previewLink || !isValidHttpUrl(previewLink)) return;
        fetchMetadata(previewLink).then((data) => {
            setMetadata(data);
        });
    }, [previewLink]);

    const AIDecistion = async (payload: string, url: string) => {
        if (!payload) return;
        try {
            const res = await axios.post(UPLOAD_ROUTES.crawler + "/decision", { content: payload });
            setInfo({
                cms: JSON.parse(res.data.cms)
            });
        } catch (err) {
            console.log(err);
        }
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setLoading(true)
            const crawlResponse = await fetch("/api/crawl", {
                method: "POST",
                body: JSON.stringify({ url: values.url.trim() }),
            })
            const response = await crawlResponse.json();
            if (response.data) {
                if (response.data.screenshot) {
                    setScreenshot("data:image/png;base64," + response.data.screenshot);
                }
                await AIDecistion(response.data.content, values.url.trim())
            }
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className="h-full max-h-[calc(100vh-176px)] overflow-hidden overflow-y-auto p-4">
            <div className="bg-muted w-full h-full mx-auto rounded-md  max-h-[560px] border">
                <div className="text-gray-600 m-auto flex items-center justify-center h-full p-8">
                    {isValidHttpUrl(previewLink) ? (
                        <div className="flex  space-x-8 h-full text-center">
                            <Card className="flex-1 px-8 h-full overflow-hidden overflow-y-auto">
                                <CardContent className="h-full ">
                                    <figure
                                        className="pt-8 h-full flex flex-col space-y-2 justify-evenly items-center">
                                        <div className="rounded-md w-full flex-1">
                                            <img
                                                className="rounded-md h-full"
                                                src={metadata.image}
                                                alt="Preview Link"
                                            />
                                        </div>
                                        <figcaption className="pb-8">
                                            <p>{metadata.title}</p>
                                            <p>{metadata.description}</p>
                                        </figcaption>
                                    </figure>
                                </CardContent>
                            </Card>
                            {(screenshot || info) && (
                                <Card className="flex-1 px-8 h-full overflow-hidden overflow-y-auto">
                                    <CardContent className="h-full p-2">
                                        <figure
                                            className="pt-8 h-full flex flex-col space-y-2 justify-evenly items-center"
                                        >
                                            {screenshot && (
                                                <div className="rounded-md flex-1 w-full">
                                                    <img
                                                        className="rounded-md h-full w-full object-contain object-top"
                                                        src={screenshot}
                                                        alt="Screenshot"
                                                    />
                                                </div>
                                            )}
                                            {info && (
                                                <figcaption className="py-8 w-full">
                                                    <Accordion type="single" collapsible className="w-full text-start">
                                                        <AccordionItem value="item-1">
                                                            <AccordionTrigger>CMS?</AccordionTrigger>
                                                            <AccordionContent>
                                                                {info.cms.cms}
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                        <AccordionItem value="item-2">
                                                            <AccordionTrigger>Description</AccordionTrigger>
                                                            <AccordionContent>
                                                                <p>{info.cms.description}</p>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                        <AccordionItem value="item-3">
                                                            <AccordionTrigger>Analytics</AccordionTrigger>
                                                            <AccordionContent>
                                                                {info.cms.analytics_tools.join(", ")}
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                </figcaption>
                                            )}
                                        </figure>
                                    </CardContent>
                                </Card>
                            )}

                        </div>
                    ) : (
                        <h1 className="text-2xl">No screenshot</h1>
                    )}
                </div>
            </div>

            {loading && (
                <div className="text-center">
                    <h1>Loading...</h1>
                </div>
            )}

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="pt-2 space-y-8"
                >
                    <FormField
                        control={form.control}
                        name="url"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Website</FormLabel>
                                <FormControl>
                                    <div className="flex justify-between items-center border rounded-md pr-2">
                                        <Input
                                            className="focus-visible:ring-0 outline-none border-none shadow-none"
                                            placeholder="Enter url to crawl a website"
                                            {...field}
                                        />
                                        <div>
                                            {isValidHttpUrl(form.getValues().url) ? (
                                                <CircleCheckBig
                                                    className="text-green-500"
                                                />
                                            ) : (
                                                <CircleX className="text-red-500" />
                                            )}
                                        </div>
                                    </div>
                                </FormControl>
                                <FormDescription>
                                    Enter the url of the website you want to crawl
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <EnhanceButton
                        type="submit"
                        disabled={loading || !isValidHttpUrl(form.getValues().url)}
                    >
                        Crawl
                    </EnhanceButton>
                </form>
            </Form>



        </div>
    )
}