// app/api/auth/create-or-signin/route.ts
import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, verifyPassword } from "@/lib/auth/user";
import { redis } from "@/config/redis";

async function checkRateLimit(email: string, ip: string): Promise<void> {
    const key = `rate:check-user:${ip}:${email}`;
    const count: number = await redis.incr(key);
    if (count === 1) await redis.expire(key, 60);
    if (count > 3) throw new Error("Too many attempts. Try again later.");
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const { email, password } = await req.json();
        if (!email || typeof email !== "string" || !password || typeof password !== "string") {
            return NextResponse.json({ error: "Email and password required" }, { status: 400 });
        }

        const ip: string =
            req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";

        await checkRateLimit(email.toLowerCase(), ip);

        const userExists = await findUserByEmail(email.toLowerCase());
        if (!userExists) {
            return NextResponse.json({ error: "No account found with this email" }, { status: 404 });
        }

        const isValid = await verifyPassword(email.toLowerCase(), password);
        if (!isValid) {
            return NextResponse.json({ error: "Invalid password" }, { status: 401 });
        }

        // Credentials are valid
        return NextResponse.json({ valid: true, message: "Credentials OK" });
        
    } catch (error: unknown) {
        let message = "Something went wrong";

        if (error instanceof Error) {
            message = error.message;
        }

        const status = message.includes("Too many") ? 429 : 400;

        return NextResponse.json({ error: message }, { status });
    }
}