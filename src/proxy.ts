// proxy.ts (ROOT LEVEL)
// ----------------------------------------------------
// Purpose:
// This proxy runs before route rendering and is used to
// protect routes based on authentication state.
//
// Features:
// - Blocks unauthenticated users from protected pages
// - Redirects authenticated users away from auth pages
// - Uses NextAuth JWT token for session validation
// ----------------------------------------------------

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req: NextRequest) {
    // Extract current route path
    const { pathname } = req.nextUrl;

    // Retrieve JWT session token from NextAuth
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
    });

    // ----------------------------------------------------
    // Rule 1: Protect /diagnose route
    // If user is NOT authenticated → redirect to /signin
    // ----------------------------------------------------
    if (pathname.startsWith("/diagnose") && !token) {
        return NextResponse.redirect(new URL("/signin", req.url));
    }

    // ----------------------------------------------------
    // Rule 2: Prevent authenticated users from accessing
    // authentication pages like /signin
    // ----------------------------------------------------
    if (pathname.startsWith("/signin") && token) {
        return NextResponse.redirect(new URL("/diagnose", req.url));
    }

    // Allow request to continue normally
    return NextResponse.next();
}

// ----------------------------------------------------
// Proxy matcher configuration
// Defines which routes this proxy should intercept
// ----------------------------------------------------
export const config = {
    matcher: [
        "/diagnose/:path*", // protect all diagnosis routes
        "/signin",          // handle auth page redirect logic
    ],
};