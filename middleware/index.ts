import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@/lib/better-auth/auth";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip middleware for auth pages, API routes, static files, and assets
    if (
        pathname.startsWith('/sign-in') ||
        pathname.startsWith('/sign-up') ||
        pathname.startsWith('/api/') ||
        pathname.startsWith('/_next/') ||
        pathname.startsWith('/assets/') ||
        pathname === '/favicon.ico'
    ) {
        return NextResponse.next();
    }

    // Check for valid session
    try {
        const auth = await getAuth();
        const session = await auth.api.getSession({
            headers: request.headers,
        });

        if (!session?.user) {
            // No valid session, redirect to sign-in
            return NextResponse.redirect(new URL("/sign-in", request.url));
        }
    } catch (error) {
        // If session check fails, redirect to sign-in
        console.error('Middleware session check failed:', error);
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|sign-in|sign-up|assets).*)',
    ],
};