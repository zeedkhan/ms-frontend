import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebounce } from "use-debounce";
import { useEffect, useState } from "react";
import { CircleCheckBig, CircleX } from "lucide-react";
import { EnhanceButton } from "@/components/ui/enhance-button";
import axios from "axios";
import { UPLOAD_ROUTES } from "@/routes";


function isValidHttpUrl(string: string) {
    try {
        const newUrl = new URL(string);
        return newUrl.protocol === 'http:' || newUrl.protocol === 'https:';
    } catch (err) {
        return false;
    }
};

type AIResponse = {
    cms: {
        possible_cms: string[],
        analytics_tools: string[],
        cms: string,
        website_content: string,
        framework: string[],
    }
}

type MetaData = {
    title: string,
    description: string,
    image: string,
    markup: {
        scripts: string[],
        metas: string[]
    }
}


const fetchMetadata = async (url: string): Promise<MetaData> => {
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

        const parser = new DOMParser();
        const doc = parser.parseFromString(data.data, 'text/html');

        const metas = Array.from(doc.querySelectorAll('meta')).map((meta) => meta.outerHTML || "");
        const allScripts = Array.from(doc.querySelectorAll("script"))
            .map((script) => script.outerHTML)
            .filter((script) => script.length < 1000);

        const title = doc.querySelector('meta[property="og:title"]')?.getAttribute("content") || '';
        const description = doc.querySelector('meta[property="og:description"]')?.getAttribute("content") || '';
        const image = doc.querySelector('meta[property="og:image"]')?.getAttribute("content") || '';

        return { title, description, image, markup: { scripts: allScripts, metas: metas } };
    } catch (error) {
        console.error('Error fetching metadata:', error);
        return { title: "", description: "", image: "", markup: { scripts: [], metas: [] } };
    }
};


const formSchema = z.object({
    url: z.string().url({
        message: "Invalid url",
    }),
});

const Crawler = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            url: "",
        },
    });
    const url = form.watch("url");
    const [loading, setLoading] = useState<boolean>(false);

    const [previewLink] = useDebounce(url, 1000);
    useEffect(() => {
        if (!previewLink || !isValidHttpUrl(previewLink)) return;
        fetchMetadata(previewLink).then((data) => {
            setMetadata(data);
        });
    }, [previewLink]);
    const [metadata, setMetadata] = useState<MetaData | null>(null);
    const [info, setInfo] = useState<AIResponse | null>(null);

    const AIDecistion = async (metaData: MetaData, url: string) => {
        try {
            const res = await axios.post(UPLOAD_ROUTES.crawler + "/decision", { content: JSON.stringify({ ...metaData, url: url }) });
            setInfo({
                cms: JSON.parse(res.data.cms)
            });
        } catch (err) {
            console.log(err);
        }
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setLoading(true);
            if (!metadata) return;
            await AIDecistion(metadata, values.url);
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    };

    return (
        <>
            <div className="bg-muted w-full max-h-full h-fit mx-auto rounded-md overflow-hidden overflow-y-auto  border">
                <div className="text-gray-600 w-full m-auto flex items-center justify-center h-full p-8">
                    {isValidHttpUrl(previewLink) && metadata ? (
                        <Card className="text-center px-8 h-full w-full">
                            <CardContent className="h-full w-full">
                                <figure
                                    className="pt-8 h-full">
                                    <div className={cn(
                                        `rounded-md w-full h-full`,
                                        `max-h-[200px]`,
                                    )}>
                                        <img
                                            className="rounded-md max-h-[200px] h-full w-full object-contain object-top"
                                            src={metadata.image}
                                            alt="Preview Link"
                                        />
                                    </div>
                                    {info && (
                                        <figcaption className="py-8 w-full">
                                            <Accordion type="single" collapsible className="text-start">
                                                <AccordionItem value="item-1">
                                                    <AccordionTrigger>CMS?</AccordionTrigger>
                                                    <AccordionContent>
                                                        {info.cms.cms}
                                                    </AccordionContent>
                                                </AccordionItem>
                                                <AccordionItem value="item-2">
                                                    <AccordionTrigger>Description</AccordionTrigger>
                                                    <AccordionContent>
                                                        <p>{info.cms.website_content}</p>
                                                    </AccordionContent>
                                                </AccordionItem>
                                                <AccordionItem value="item-3">
                                                    <AccordionTrigger>Analytics</AccordionTrigger>
                                                    <AccordionContent>
                                                        {info.cms.analytics_tools.join(", ")}
                                                    </AccordionContent>
                                                </AccordionItem>
                                                <AccordionItem value="item-4">
                                                    <AccordionTrigger>Frameworks</AccordionTrigger>
                                                    <AccordionContent>
                                                        {info.cms.framework.join(", ")}
                                                    </AccordionContent>
                                                </AccordionItem>
                                            </Accordion>
                                        </figcaption>
                                    )}
                                    <figcaption className="pb-8 w-full">
                                        <p>{metadata.title}</p>
                                        <p>{metadata.description}</p>
                                    </figcaption>
                                </figure>
                            </CardContent>
                        </Card>
                    ) : (
                        <h1 className="text-2xl">No screenshot</h1>
                    )}
                </div>
            </div>

            {
                loading && (
                    <div className="text-center">
                        <h1>Loading...</h1>
                    </div>
                )
            }

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
        </>

    )
};

export default Crawler;