"use client";

import React, { useEffect, useState } from "react";
import { analyzeNewsSentiment } from "@/lib/actions/ai.actions";

interface Props {
    headline: string;
}

export function SentimentBadge({ headline }: Props) {
    const [sentiment, setSentiment] = useState<"Bullish" | "Bearish" | "Neutral" | null>(null);

    useEffect(() => {
        let mounted = true;
        async function fetchSentiment() {
            const { sentiment } = await analyzeNewsSentiment(headline);
            if (mounted) setSentiment(sentiment);
        }
        fetchSentiment();
        return () => { mounted = false; };
    }, [headline]);

    if (!sentiment) {
        return (
            <span style={{
                fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700,
                padding: "2px 8px", borderRadius: 5, background: "var(--nt-surface3)",
                color: "var(--nt-txt3)", animation: "pulse 1.5s infinite"
            }}>
                Analyzing...
            </span>
        );
    }

    const config = {
        Bullish: { col: "var(--nt-green)", bg: "var(--nt-green-dim)" },
        Bearish: { col: "var(--nt-red)", bg: "var(--nt-red-dim)" },
        Neutral: { col: "var(--nt-blue)", bg: "var(--nt-blue-dim)" }
    }[sentiment];

    return (
        <span style={{
            fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700,
            padding: "2px 8px", borderRadius: 5, background: config.bg, color: config.col
        }}>
            ● {sentiment}
        </span>
    );
}
