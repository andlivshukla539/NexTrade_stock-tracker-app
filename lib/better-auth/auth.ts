import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { connectToDatabase } from "@/database/mongoose";
import { nextCookies } from "better-auth/next-js";
import type { Db } from "mongodb";

let authInstance: ReturnType<typeof betterAuth> | null = null;

export const getAuth = async () => {
    if (authInstance) return authInstance;

    console.log("🔄 Initializing Better Auth...");

    if (!process.env.BETTER_AUTH_SECRET) {
        console.error("❌ BETTER_AUTH_SECRET is missing in environment variables.");
        throw new Error("BETTER_AUTH_SECRET is not defined");
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
        console.warn("⚠️ GOOGLE_CLIENT_ID is missing. Google Sign-In will not work.");
    }

    const mongoose = await connectToDatabase();
    console.log("✅ MongoDB Connected for Auth");

    const db = mongoose.connection.db;

    if (!db) {
        console.error("❌ MongoDB connection successful but 'db' instance is missing.");
        throw new Error('MongoDB connection not found');
    }

    authInstance = betterAuth({
        database: mongodbAdapter(db as Db),
        secret: process.env.BETTER_AUTH_SECRET,
        baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000", // Fallback for safety
        emailAndPassword: {
            enabled: true,
            disableSignUp: false,
            requireEmailVerification: false,
            minPasswordLength: 8,
            maxPasswordLength: 128,
            autoSignIn: true,
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

    console.log("✅ Better Auth initialized successfully");
    return authInstance;
}

export const auth = await getAuth();
