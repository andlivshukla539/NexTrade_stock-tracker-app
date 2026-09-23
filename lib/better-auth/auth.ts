import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";
import { nextCookies } from "better-auth/next-js";

let authInstance: ReturnType<typeof betterAuth> | null = null;

export const getAuth = async () => {
    if (authInstance) return authInstance;

    // Only include Google OAuth if credentials are actually configured
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const hasGoogleOAuth = !!(googleClientId && googleClientSecret);

    const socialProviders: Record<string, unknown> = {};
    if (hasGoogleOAuth) {
        socialProviders.google = {
            enabled: true,
            clientId: googleClientId,
            clientSecret: googleClientSecret,
        };
    }

    authInstance = betterAuth({
        database: prismaAdapter(prisma, {
            provider: "postgresql",
        }),
        secret: process.env.BETTER_AUTH_SECRET || "dev-secret-change-me-in-production-32chars",
        baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
        emailAndPassword: {
            enabled: true,
            disableSignUp: false,
            requireEmailVerification: false,
            minPasswordLength: 8,
            maxPasswordLength: 128,
            autoSignIn: true,
        },
        ...(Object.keys(socialProviders).length > 0 && { socialProviders }),
        plugins: [nextCookies()],
    });

    return authInstance;
}

export const auth = await getAuth();
