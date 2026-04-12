// app/api/v1/diagnose/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { redis } from "@/config/redis"; // existing Redis client

// Rate limit configuration
const RATE_LIMITS = {
    PER_MINUTE: { limit: 2, window: 60 },      // 2 requests per minute
    PER_HOUR: { limit: 5, window: 3600 },    // 5 requests per hour
};

// Helper: check and consume rate limit
async function checkRateLimit(userId: string, type: 'minute' | 'hour'): Promise<boolean> {
    const { limit, window } = RATE_LIMITS[type === 'minute' ? 'PER_MINUTE' : 'PER_HOUR'];
    const key = `diagnosis:ratelimit:${userId}:${type}`;
    const current = await redis.incr(key);
    if (current === 1) await redis.expire(key, window);
    return current <= limit;
}

export async function POST(req: NextRequest) {
    // 1. Authenticate user
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = token.email; // use email as unique user identifier

    // 2. Rate limiting
    const canProceedMinute = await checkRateLimit(userId, 'minute');
    const canProceedHour = await checkRateLimit(userId, 'hour');

    if (!canProceedMinute) {
        return NextResponse.json(
            { error: "Too many requests. Please wait a minute before trying again." },
            { status: 429 }
        );
    }
    if (!canProceedHour) {
        return NextResponse.json(
            { error: "Hourly limit reached (5 requests). Please try again later." },
            { status: 429 }
        );
    }

    // 3. Parse multipart form data
    let formData: FormData;
    try {
        formData = await req.formData();
    } catch {
        return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }

    const file = formData.get("file") as File | null;
    if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 4. Forward to FastAPI with API key
    const fastApiUrl = process.env.FASTAPI_URL;
    const fastApiKey = process.env.FAST_API_KEY;
    if (!fastApiUrl || !fastApiKey) {
        console.error("Missing FASTAPI_URL or FAST_API_KEY environment variables");
        return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    try {
        const forwardForm = new FormData();
        forwardForm.append("file", file);

        const response = await fetch(`${fastApiUrl}/api/predict`, {
            method: "POST",
            headers: {
                "X-API-Key": fastApiKey, // FastAPI expects this header
            },
            body: forwardForm,
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error("FastAPI proxy error:", error);
        return NextResponse.json(
            { error: "Failed to reach disease prediction service" },
            { status: 502 }
        );
    }
}