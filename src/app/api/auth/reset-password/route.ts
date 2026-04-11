import { NextRequest, NextResponse } from "next/server";
import { OTPService, RateLimitError, OTPValidationError } from "@/lib/otp";
import { updatePassword } from "@/lib/auth/user";

export async function POST(req: NextRequest) {
    try {
        const rawBody = await req.text();
        console.log('📦 Raw body:', rawBody);

        const parsed = JSON.parse(rawBody);
        console.log('🔎 Parsed object:', parsed);
        console.log('email:', parsed.email, 'type:', typeof parsed.email);
        console.log('otp:', parsed.otp, 'type:', typeof parsed.otp);
        console.log('newPassword:', parsed.newPassword, 'type:', typeof parsed.newPassword);

        const { email, otp, newPassword } = parsed;

        if (!email || !otp || !newPassword) {
            return NextResponse.json(
                { error: "Email, OTP, and new password required" },
                { status: 400 }
            );
        }
        if (newPassword.length < 6) {
            return NextResponse.json(
                { error: "Password must be at least 6 characters" },
                { status: 400 }
            );
        }

        const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
        await OTPService.verify(email, otp, ip);
        await updatePassword(email.toLowerCase(), newPassword);

        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        console.error('❌ Full error:', error);

        // Normalize error to a string
        let errorMessage = "Password reset failed";
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === "string") {
            errorMessage = error;
        } else if (error && typeof error === "object") {
            errorMessage = JSON.stringify(error);
        }

        // Return proper JSON regardless
        return NextResponse.json(
            { error: errorMessage },
            { status: error instanceof RateLimitError ? 429 : 400 }
        );
    }
}