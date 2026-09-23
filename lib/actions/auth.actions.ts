'use server';

import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";

export const signUpWithEmail = async ({ email, password, fullName, country, investmentGoals, riskTolerance, preferredIndustry }: SignUpFormData) => {
    try {
        const response = await auth.api.signUpEmail({ body: { email, password, name: fullName } })

        if (response) {
            // Send welcome email asynchronously — non-critical, don't block signup
            try {
                const { inngest } = await import("@/lib/inngest/client");
                await inngest.send({
                    name: 'app/user.created',
                    data: { email, name: fullName, country, investmentGoals, riskTolerance, preferredIndustry }
                })
            } catch (emailError) {
                console.warn('Welcome email skipped (Inngest not available):', emailError instanceof Error ? emailError.message : emailError)
            }
        }

        return { success: true, data: response }
    } catch (e: unknown) {
        console.error('Sign up failed:', e)
        const errorMessage = e instanceof Error ? e.message : 'Sign up failed. Please try again.'
        return { success: false, error: errorMessage }
    }
}

export const signInWithEmail = async ({ email, password, rememberMe }: { email: string, password: string, rememberMe?: boolean }) => {
    try {
        const response = await auth.api.signInEmail({
            headers: await headers(),
            body: {
                email,
                password,
                rememberMe
            }
        })

        return { success: true, data: response }
    } catch (e: unknown) {
        console.error('Sign in failed:', e)
        const errorMessage = e instanceof Error ? e.message : 'Invalid email or password. Please try again.'
        return { success: false, error: errorMessage }
    }
}

export const signOut = async () => {
    try {
        await auth.api.signOut({ headers: await headers() });
        return { success: true }
    } catch (e: unknown) {
        console.error('Sign out failed:', e)
        const errorMessage = e instanceof Error ? e.message : 'Sign out failed. Please try again.'
        return { success: false, error: errorMessage }
    }
}
