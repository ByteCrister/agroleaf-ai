import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail } from "@/lib/auth/user";
import { redis } from "@/config/redis";

/**
 * Rate limit: 10 requests per minute per IP
 */
async function checkRateLimit(ip: string): Promise<void> {
    const key = `rate:check-user:${ip}`;
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, 60);
    if (count > 10) throw new Error("Too many requests. Please try again later.");
}

export async function POST(req: NextRequest) {
    try {
        const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
        await checkRateLimit(ip);

        const { email } = await req.json();
        if (!email || typeof email !== "string") {
            return NextResponse.json({ error: "Email required" }, { status: 400 });
        }

        const exists = await findUserByEmail(email.toLowerCase());
        return NextResponse.json({ exists: !!exists });
    } catch (error: any) {
        const status = error.message.includes("Too many") ? 429 : 400;
        return NextResponse.json({ error: error.message }, { status });
    }
}