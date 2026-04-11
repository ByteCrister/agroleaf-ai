import { NextRequest, NextResponse } from "next/server";
import { OTPService, RateLimitError } from "@/lib/otp";
import { findUserByEmail } from "@/lib/auth/user";
import generateOtpEmailHtml from "@/lib/generateOtpEmailHtml";
import { mailer } from "@/config/nodemailer";

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();
        if (!email || typeof email !== "string") {
            return NextResponse.json({ error: "Email required" }, { status: 400 });
        }

        const exists = await findUserByEmail(email.toLowerCase());
        if (!exists) {
            return NextResponse.json(
                { error: "No account found with this email" },
                { status: 404 }
            );
        }

        const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
        const otp = await OTPService.send(email, ip);
        const htmlContent = generateOtpEmailHtml(email, otp);
        await mailer(email, "Your Password Reset Code", htmlContent);
        console.log(`🔐 Password reset OTP for ${email}: ${otp}`); 

        return NextResponse.json({ success: true });
    } catch (error: any) {
        const status = error instanceof RateLimitError ? 429 : 400;
        return NextResponse.json({ error: error.message }, { status });
    }
}