'use server';

import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

const google = createGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY || '',
});

export async function generateCompanySummary(symbol: string, companyName: string) {
    try {
        const { text } = await generateText({
            model: google('gemini-2.0-flash'),
            prompt: `You are a professional financial analyst. Write a highly concise, 2-3 sentence summary of the company ${companyName} (${symbol}). Focus on their core business model, key products, and recent market positioning. Keep it informative, objective, and do not include financial advice.`,
        });

        return { summary: text };
    } catch (error) {
        console.error("AI Summary Error:", error);
        return { summary: "Company summary is currently unavailable. Please check your API configuration." };
    }
}

export async function analyzeNewsSentiment(newsHeadline: string) {
    try {
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
