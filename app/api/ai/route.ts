import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, response: NextResponse) {
    try {
        const req = await axios.get(process.env.NEXT_PUBLIC_GATEWAY + "/upload/generative")
        console.log(req.data)
        return NextResponse.json({ message: 'Hello from AI API' });
    } catch (error) {
        console.error(error);
    }

    return NextResponse.json({ message: 'Hello from AI API' });
}