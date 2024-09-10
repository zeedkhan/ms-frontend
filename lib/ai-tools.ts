import { AI_ROUTES } from "@/routes"
import axios from "axios"
import { z } from "zod";
import { sanitizeUrl } from "./utils";
import { SearchResultImage, SearchResults } from "@/types";
import { tool } from "ai";

export const WeatherResponseTypes = ['sunny', 'cloudy', 'rainy', 'snowy', 'windy'] as const;
export const typesOfDegree = ['celsius', 'fahrenheit'] as const;
export const displayWeatherInformation = {
    description: `
    A tool for showing weather information with generative UI, Example: sunny, cloudy, rainy, snowy, windy.
    If you don't know the weather information, you can use other tools to get the information.`,
    parameters: z.object({
        weather: z
            .enum(WeatherResponseTypes)
            .transform((val) => val.toLowerCase())
            .describe("The message of the type weather to render the UI."),
        location: z.string().optional().describe("The location of the weather information."),
        degree: z.number().optional().describe("The degree of the weather information."),
        typeDegree: z.enum(typesOfDegree).optional().describe("The type of the degree of the weather information."),
    }),
    execute: async ({
        weather, location, degree, typeDegree
    }: {
        weather: string,
        location?: string,
        degree?: number,
        typeDegree?: string
    }) => {
        try {
            return {
                weather, location, degree, typeDegree
            };
        } catch (error) {
            console.error(error);
            return {
                weather: 'Failed to get weather report',
                location: 'Failed to get location',
                degree: 'Failed to get degree',
                typeDegree: 'Failed to get type degree',
            };
        }
    }
};


export const searchTool = tool({
    description: 'Search information on the internet',
    parameters: z.object({
        query: z.string(),
        maxResults: z.number().optional().default(10),
        searchDepth: z.enum(['basic', 'advanced']).optional().default('basic'),
        includeDomains: z.array(z.string()).optional().default([]),
        excludeDomains: z.array(z.string()).optional().default([]),
    }),
    execute: async ({ query, maxResults, searchDepth, includeDomains, excludeDomains }) => {
        try {
            const searchResult = await tavilySearch(query, maxResults, searchDepth, includeDomains, excludeDomains);
            return searchResult;
        } catch (error) {
            console.error(error);
            return 'Failed to search';
        }
    }
});


async function tavilySearch(
    query: string,
    maxResults: number = 10,
    searchDepth: 'basic' | 'advanced' = 'basic',
    includeDomains: string[] = [],
    excludeDomains: string[] = []
): Promise<SearchResults> {
    const apiKey = process.env.TAVILY_API_KEY
    if (!apiKey) {
        throw new Error('TAVILY_API_KEY is not set in the environment variables')
    }
    const includeImageDescriptions = true
    const response = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            api_key: apiKey,
            query,
            max_results: Math.max(maxResults, 5),
            search_depth: searchDepth,
            include_images: true,
            include_image_descriptions: includeImageDescriptions,
            include_answers: true,
            include_domains: includeDomains,
            exclude_domains: excludeDomains
        })
    })

    if (!response.ok) {
        throw new Error(
            `Tavily API error: ${response.status} ${response.statusText}`
        )
    }

    const data = await response.json()
    const processedImages = includeImageDescriptions
        ? data.images
            .map(({ url, description }: { url: string; description: string }) => ({
                url: sanitizeUrl(url),
                description
            }))
            .filter(
                (
                    image: SearchResultImage
                ): image is { url: string; description: string } =>
                    typeof image === 'object' &&
                    image.description !== undefined &&
                    image.description !== ''
            )
        : data.images.map((url: string) => sanitizeUrl(url))

    return {
        ...data,
        images: processedImages
    }
}


// export const searchTool = async ({ q }: { q: string }) => {
//     try {
//         const response = await axios.get(AI_ROUTES.search + `?q=${encodeURIComponent(q)}`);
//         return response.data;
//     } catch (error) {
//         console.error(error);
//         return "Failed to search";
//     }
// };

export const getWeatherInformationTool = async ({ lat, lon }: { lat: number, lon: number }) => {
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}`);
        return response.data;
    } catch (error) {
        console.error(error);
        return 'Failed to get weather report';
    }
}