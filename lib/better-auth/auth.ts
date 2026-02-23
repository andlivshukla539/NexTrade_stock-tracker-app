import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { connectToDatabase } from "@/database/mongoose";
import { nextCookies } from "better-auth/next-js";
import type { Db } from "mongodb";
import { transporter } from "@/lib/nodemailer";
import { EMAIL_VERIFICATION_TEMPLATE } from "@/lib/nodemailer/templates";

let authInstance: ReturnType<typeof betterAuth> | null = null;

export const getAuth = async () => {
    if (authInstance) return authInstance;

    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;

    if (!db) throw new Error('MongoDB connection not found');

    authInstance = betterAuth({
        database: mongodbAdapter(db as Db),
        secret: process.env.BETTER_AUTH_SECRET,
        baseURL: process.env.BETTER_AUTH_URL,
        emailAndPassword: {
            enabled: true,
            disableSignUp: false,
            requireEmailVerification: true,
            minPasswordLength: 8,
            maxPasswordLength: 128,
            autoSignIn: false,
        },
        emailVerification: {
            sendOnSignUp: true,
            autoSignInAfterVerification: true,
            sendVerificationEmail: async ({ user, url }) => {
                const name = user.name || user.email.split('@')[0];
                const html = EMAIL_VERIFICATION_TEMPLATE
                    .replace(/{{name}}/g, name)
                    .replace(/{{url}}/g, url);
                await transporter.sendMail({
                    from: `"NexTrade" <${process.env.NODEMAILER_EMAIL}>`,
                    to: user.email,
                    subject: '📧 Verify your NexTrade email address',
                    html,
                });
            },
        },
        socialProviders: {
            google: {
                enabled: true,
                clientId: process.env.GOOGLE_CLIENT_ID || "",
                clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
            },
        },
        plugins: [nextCookies()],
    });

    return authInstance;
}

export const auth = await getAuth();
