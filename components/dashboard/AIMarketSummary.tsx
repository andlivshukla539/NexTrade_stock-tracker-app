"use client";

import React from "react";

type Mood = "bullish" | "bearish" | "neutral";

const moodEmoji: Record<Mood, { emoji: string; color: string }> = {
    bullish: { emoji: "🟢", color: "text-green-400" },
    bearish: { emoji: "🔴", color: "text-red-400" },
    neutral: { emoji: "🟡", color: "text-yellow-400" },
};

export default function AIMarketSummary() {
    // Mock summary data
    const mood: Mood = "neutral";
    const summary =
        "Tech stocks slide as NVDA and AAPL dip. Energy leads the market higher.";

    const { emoji, color } = moodEmoji[mood];

    return (
        <div className="w-full h-full rounded-lg border border-gray-600 bg-gray-800 p-4 md:p-5">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-100 text-lg font-semibold">
                    AI Market Summary
                </h3>
                <span className={`text-2xl ${color}`} aria-label="sentiment">
            {emoji}
          </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">{summary}</p>
            <div className="mt-3 text-xs text-gray-500">
                Mood: <span className="capitalize">{mood}</span>
            </div>
        </div>
    );
}
