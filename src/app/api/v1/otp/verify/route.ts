import { NextRequest, NextResponse } from "next/server";
import { OTPService, RateLimitError, OTPValidationError } from "@/lib/otp";

/**
 * Request body expected by POST /api/v1/otp/verify
 */
interface VerifyOTPRequest {
    email: string;
    otp: string;
}

/**
 * Success response structure
 */
interface VerifyOTPSuccessResponse {
    success: true;
}

/**
 * Error response structure
 */
interface ErrorResponse {
    error: string;
}

/**
 * POST /api/v1/otp/verify
 *
 * Verifies a one-time password for the specified email.
 * Rate limited to 5 verification attempts per email per minute.
 * OTP is automatically deleted after successful verification or 5 failed attempts.
 *
 * @example
 * curl -X POST http://localhost:3000/api/v1/otp/verify \
 *   -H "Content-Type: application/json" \
 *   -d '{"email": "user@example.com", "otp": "123456"}'
 */
export async function POST(
    req: NextRequest
): Promise<NextResponse<VerifyOTPSuccessResponse | ErrorResponse>> {
    try {
        // Parse and validate request body
        let body: VerifyOTPRequest;
        try {
            body = await req.json();
        } catch {
            return NextResponse.json(
                { error: "Invalid JSON payload" },
                { status: 400 }
            );
        }

        const { email, otp } = body;

        if (!email || typeof email !== "string") {
            return NextResponse.json(
                { error: "Email is required and must be a string" },
                { status: 400 }
            );
        }

        if (!otp || typeof otp !== "string") {
            return NextResponse.json(
                { error: "OTP is required and must be a string" },
                { status: 400 }
            );
        }

        // Validate OTP format (6 digits)
        if (!/^\d{6}$/.test(otp)) {
            return NextResponse.json(
                { error: "OTP must be a 6-digit number" },
                { status: 400 }
            );
        }

        // Get client IP for optional security check
        const ip =
            req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
            req.headers.get("x-real-ip") ||
            "unknown";

        await OTPService.verify(email, otp, ip);

        return NextResponse.json({ success: true });
    } catch (error) {
        // Handle rate limiting (429)
        if (error instanceof RateLimitError) {
            return NextResponse.json(
                { error: error.message },
                { status: 429 }
            );
        }

        // Handle OTP validation errors (400)
        if (error instanceof OTPValidationError) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            );
        }

        // Generic error fallback
        const message = error instanceof Error ? error.message : "Verification failed";
        return NextResponse.json(
            { error: message },
            { status: 400 }
        );
    }
}