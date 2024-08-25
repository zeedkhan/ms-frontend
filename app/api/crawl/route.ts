import { UPLOAD_ROUTES } from "@/routes";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

export async function POST(request: NextRequest, response: NextResponse) {
    const body = await request.json();
    try {
        const res = await axios.post(UPLOAD_ROUTES.crawler + "/crawl", body);
        if (res.status === 200) {
            return NextResponse.json({ data: res.data }, { status: 200 });
        }
        return NextResponse.json({ error: "Failed to crawl" }, { status: 500 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to crawl" }, { status: 500 });
    }
}