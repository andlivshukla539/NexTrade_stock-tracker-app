'use server';

import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

function getGoogleAI() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return createGoogleGenerativeAI({ apiKey });
}

export async function generateCompanySummary(symbol: string, companyName: string) {
    try {
        const google = getGoogleAI();
        if (!google) {
            return { summary: `${companyName} (${symbol}) — AI summary unavailable. Add GEMINI_API_KEY to your .env to enable AI insights.` };
        }

        // Try gemini-2.0-flash first, fallback to 1.5-flash
        const models = ['gemini-2.0-flash', 'gemini-1.5-flash'];
        for (const modelName of models) {
            try {
                const { text } = await generateText({
                    model: google(modelName),
                    prompt: `You are a professional financial analyst. Write a highly concise, 2-3 sentence summary of the company ${companyName} (${symbol}). Focus on their core business model, key products, and recent market positioning. Keep it informative, objective, and do not include financial advice.`,
                });
                return { summary: text };
            } catch (modelError) {
                console.warn(`Model ${modelName} failed, trying next...`, modelError instanceof Error ? modelError.message : modelError);
                continue;
            }
        }

        return { summary: "Company summary is temporarily unavailable. Please add a valid GEMINI_API_KEY to your .env to enable AI insights." };
    } catch (error) {
        console.error("AI Summary Error:", error);
        return { summary: "Company summary is currently unavailable. Please check your API configuration." };
    }
}

export async function analyzeNewsSentiment(newsHeadline: string) {
    try {
        const google = getGoogleAI();
        if (!google) {
            return { sentiment: "Neutral" as const };
        }

        const { text } = await generateText({
            model: google('gemini-2.0-flash'),
            prompt: `Analyze the following financial news headline and classify its sentiment strictly as either "Bullish", "Bearish", or "Neutral". Return ONLY the single word.\n\nHeadline: "${newsHeadline}"`,
        });

        const cleanText = text.trim().replace(/[^a-zA-Z]/g, '');
        if (["Bullish", "Bearish", "Neutral"].includes(cleanText)) {
            return { sentiment: cleanText as "Bullish" | "Bearish" | "Neutral" };
        }
        return { sentiment: "Neutral" as const };
    } catch (error) {
        console.error("AI Sentiment Error:", error);
        return { sentiment: "Neutral" as const };
    }
}