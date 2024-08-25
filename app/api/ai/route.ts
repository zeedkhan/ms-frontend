import { UPLOAD_ROUTES } from "@/routes";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

export async function POST(request: NextRequest, response: NextResponse) {
    const f = await request.formData();
    const query = f.get("query");
    const socketID = request.headers.get("x-socket-id");

    f.delete("query");

    try {
        const res = await axios.post(UPLOAD_ROUTES.uploadTranscriptMemory + query, f, {
            headers: {
                "Content-Type": "multipart/form-data",
                "x-socket-id": socketID,
            }
        });

        return NextResponse.json({ response: res.data }, { status: 200 });
    } catch (error) {
        console.error(error);
    }
}