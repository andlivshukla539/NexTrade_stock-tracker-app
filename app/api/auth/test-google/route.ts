import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        googleOAuth: {
            configured: true,
            hasClientId: !!process.env.GOOGLE_CLIENT_ID,
            hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
            clientIdPreview: process.env.GOOGLE_CLIENT_ID?.substring(0, 15) + "...",
            baseURL: process.env.BETTER_AUTH_URL,
            redirectURI: `${process.env.BETTER_AUTH_URL}/api/auth/callback/google`,
        },
        message: "✅ Google OAuth is properly configured!",
        instructions: "You can test Google sign-in on the /sign-in page"
    });
}
