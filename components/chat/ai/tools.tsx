"use client";

import { Card, CardContent } from "@/components/ui/card";
import { EnhanceButton } from "@/components/ui/enhance-button";
import { cn } from "@/lib/utils";
import { ToolInvocation } from "ai"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Markdown from "@/components/editor/markdown";
import { SearchResults as SearchResultProps } from "@/types";
import Image from "next/image";
import { SearchImages } from "./tools/search-item";


const AskForConfirmation = ({
    addResult,
    toolInvocation
}: {
    addResult: (result: string) => void;
    toolInvocation: ToolInvocation;
}) => {
    return (
        <div>
            <Markdown content={toolInvocation.args.message} />
            <div>
                {'result' in toolInvocation ? (
                    <div className="flex flex-col space-y-1 pt-8">
                        <small className="text-sm text-gray-600">Your response: <b>{toolInvocation.result}</b></small>
                    </div>
                ) : (
                    <Card className={cn(
                        `mt-8`,
                        `border-none`
                    )}>
                        <CardContent className={cn(
                            `p-4 flex items-center space-x-4`,

                        )}>
                            <small className="text-sm text-gray-600">Give response to AI</small>
                            <div className="flex space-x-2">
                                <EnhanceButton size={"sm"} variant={"default"} onClick={() => addResult('Yes')}>
                                    Yes
                                </EnhanceButton>
                                <EnhanceButton size={"sm"} variant={"destructive"} onClick={() => addResult('No')}>
                                    No
                                </EnhanceButton>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
};

type WeatherInformationResultProps = {
    result: {
        weather: string,
        location?: string,
        degree?: number,
        typeDegree?: string
    }
}

const WeatherInformationResult: React.FC<WeatherInformationResultProps> = ({ result }) => {
    return (
        <Card className="w-fit mx-auto">
            <CardContent
                className="text-center text-gray-600 flex flex-col space-y-4 p-2"
            >
                <div>
                    {result.location && <b>{result.location}</b>}
                    <Markdown content={`Weather: <b>${result.weather}</b>`} />
                    {result.degree && <b>{result.degree} {result.typeDegree}</b>}
                </div>

                <img
                    className="w-48 h-48 mx-auto"
                    src={`/3d-weather-icons/${result.weather}.svg`}
                    alt={`Weather - ${result.weather}`}
                />
            </CardContent>
        </Card>
    );
};

const SearchResult: React.FC<{ result: SearchResultProps }> = ({ result }) => {
    const images = result.images.map((item) => item);
    return (
        <div className="text-sm flex flex-col space-y-4">
            <p>{result.query}</p>
            <SearchImages images={images} />
            {/* <p>{result?.answer}</p> */}
            {/* {result.results.map((item) => item.title).join(', ')} */}
            {/* {JSON.stringify(result.results, null, 2)} */}
        </div>
    );
};

const Result: React.FC<{ toolInvocation: ToolInvocation }> = ({
    toolInvocation
}) => {
    if ('result' in toolInvocation) {
        if (toolInvocation.toolName === 'displayWeatherInformation') {
            return <WeatherInformationResult result={toolInvocation.result} />
        };

        if (toolInvocation.toolName === 'search') {
            return <SearchResult result={toolInvocation.result} />
        }

        return (
            <div className="text-gray-600 flex flex-col space-y-1">
                <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Tool call Is {`${toolInvocation.toolName}: `}</AccordionTrigger>
                        <AccordionContent>
                            <Markdown content={JSON.stringify(toolInvocation.result)} />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>


            </div>
        );
    };

    return <div>Calling {toolInvocation.toolName}...</div>
}

const Tools: React.FC<{
    toolInvocation: ToolInvocation;
    addToolResult: ({ toolCallId, result, }: { toolCallId: string; result: any; }) => void
}> = ({ toolInvocation, addToolResult }) => {
    const toolCallId = toolInvocation.toolCallId;
    const addResult = (result: string) => addToolResult({ toolCallId, result });


    /*
        User interaction with the tool.
    */
    if (toolInvocation.toolName === 'askForConfirmation') {
        return <AskForConfirmation addResult={addResult} toolInvocation={toolInvocation} />
    }

    return <Result toolInvocation={toolInvocation} />
};


export default Tools;