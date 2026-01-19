import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
    const sessionCookie = getSessionCookie(request);

    if (!sessionCookie) {
        // Only redirect if the request is not for auth pages or API routes
        const { pathname } = request.nextUrl;
        if (!pathname.startsWith('/sign-in') && 
            !pathname.startsWith('/sign-up') && 
            !pathname.startsWith('/api/') &&
            !pathname.startsWith('/_next/') &&
            !pathname.startsWith('/assets/')) {
            return NextResponse.redirect(new URL("/sign-in", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|sign-in|sign-up|assets).*)',
    ],
};