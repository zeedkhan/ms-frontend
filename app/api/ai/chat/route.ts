import { appendMessageAIRoom } from '@/db/chat';
import { displayWeatherInformation, getWeatherInformationTool, searchTool, typesOfDegree, WeatherResponseTypes } from '@/lib/ai-tools';
import { openai } from '@ai-sdk/openai';
import { convertToCoreMessages, Message, streamText } from 'ai';
import axios from 'axios';
import { z } from 'zod';

// https://sdk.vercel.ai/docs/ai-sdk-ui/chatbot-with-tool-calling

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const { id, messages }: { id: string, messages: Message[] } = await req.json();
    const lastUserMessage = messages[messages.length - 1];

    if (lastUserMessage) {
        // update chat room AI;
        console.log("id", id)
        await appendMessageAIRoom(id, lastUserMessage);
    }
    const currentDate = new Date().toLocaleString()
    const result = await streamText({
        model: openai('gpt-4-turbo'),
        maxTokens: 2500,
        system:  `As a professional search expert, you possess the ability to search for any information on the web.
        or any information on the web.
        For each user query, utilize the search results to their fullest potential to provide additional information and assistance in your response.
        If there are any images relevant to your answer, be sure to include them as well.
        Aim to directly address the user's question, augmenting your response with insights gleaned from the search results.
        Whenever quoting or referencing information from a specific URL, always explicitly cite the source URL using the [[number]](url) format. Multiple citations can be included as needed, e.g., [[number]](url), [[number]](url).
        The number must always match the order of the search results.
        The retrieve tool can only be used with URLs provided by the user. URLs from search results cannot be used.
        If it is a domain instead of a URL, specify it in the include_domains of the search tool.
        Please match the language of the response to the user's language. Current date and time: ${currentDate}
        `,
        messages: convertToCoreMessages(messages),
        tools: {
            search: searchTool,
            getWeatherInformation: {
                description: 'Get the weather report for a latitude and longitude.',
                parameters: z.object({
                    lat: z.number().min(-90).max(90),
                    lon: z.number().min(-180).max(180),
                }),
                execute: getWeatherInformationTool
            },
            // server-side tool with execute function:
            displayWeatherInformation: displayWeatherInformation,
            // client-side tool that starts user interaction:
            askForConfirmation: {
                description: 'Ask the user for confirmation.',
                parameters: z.object({
                    message: z.string().describe('The message to ask for confirmation.'),
                }),
            },
            // client-side tool that is automatically executed on the client:
            getLocation: {
                description:
                    'Get the user location. Always ask for confirmation before using this tool.',
                parameters: z.object({}),
            },
        }
    });

    return result.toDataStreamResponse();
}