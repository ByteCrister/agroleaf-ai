import { NextRequest, NextResponse } from "next/server";
import { OTPService, RateLimitError } from "@/lib/otp";
import generateOtpEmailHtml from "@/lib/generateOtpEmailHtml";
import { mailer } from "@/config/nodemailer";

/**
 * Request body expected by POST /api/v1/otp/send
 */
interface SendOTPRequest {
    email: string;
}

/**
 * Success response structure
 */
interface SendOTPSuccessResponse {
    success: true;
}

/**
 * Error response structure
 */
interface ErrorResponse {
    error: string;
}

/**
 * POST /api/v1/otp/send
 *
 * Generates and sends a one-time password to the specified email.
 * Rate limited to 3 requests per email per minute.
 *
 * @example
 * curl -X POST http://localhost:3000/api/v1/otp/send \
 *   -H "Content-Type: application/json" \
 *   -d '{"email": "user@example.com"}'
 */
export async function POST(
    req: NextRequest
): Promise<NextResponse<SendOTPSuccessResponse | ErrorResponse>> {
    try {
        // Parse and validate request body
        let body: SendOTPRequest;
        try {
            body = await req.json();
        } catch {
            return NextResponse.json(
                { error: "Invalid JSON payload" },
                { status: 400 }
            );
        }

        const { email } = body;

        if (!email || typeof email !== "string") {
            return NextResponse.json(
                { error: "Email is required and must be a string" },
                { status: 400 }
            );
        }

        // Basic email format validation (optional but recommended)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Please provide a valid email address" },
                { status: 400 }
            );
        }

        // Get client IP from headers (respects proxies)
        const ip =
            req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
            req.headers.get("x-real-ip") ||
            "unknown";

        // Generate and store OTP
        const otp = await OTPService.send(email, ip);

        const htmlContent = generateOtpEmailHtml(email, otp);
        await mailer(email, "Your AgroLeaf AI OTP Code", htmlContent);

        return NextResponse.json({ success: true });
    } catch (error) {
        // Handle rate limiting specifically with 429 status code
        if (error instanceof RateLimitError) {
            return NextResponse.json(
                { error: error.message },
                { status: 429 }
            );
        }

        // Generic error fallback
        const message = error instanceof Error ? error.message : "Failed to send OTP";
        return NextResponse.json(
            { error: message },
            { status: 400 }
        );
    }
}