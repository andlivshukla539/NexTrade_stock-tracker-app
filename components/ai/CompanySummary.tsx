"use client";

import React, { useEffect, useState } from "react";
import { generateCompanySummary } from "@/lib/actions/ai.actions";

interface Props {
    symbol: string;
    companyName: string;
}

export function CompanySummary({ symbol, companyName }: Props) {
    const [summary, setSummary] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        async function fetchSummary() {
            setLoading(true);
            const { summary } = await generateCompanySummary(symbol, companyName);
            if (mounted) {
                setSummary(summary);
                setLoading(false);
            }
        }
        fetchSummary();
        return () => { mounted = false; };
    }, [symbol, companyName]);

    return (
        <div style={{
            background: "var(--nt-surface2)",
            border: "1px solid var(--nt-border)",
            borderRadius: 16,
            padding: "16px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            fontFamily: "var(--font-syne)"
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 700, color: "var(--nt-txt)" }}>
                <div style={{
                    width: 24, height: 24, borderRadius: 8,
                    background: "linear-gradient(135deg, var(--nt-gold), var(--nt-gold2))",
                    color: "#080810", display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14
                }}>✦</div>
                AI Company Insights
            </div>

            {loading ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "4px 0" }}>
                    <div style={{ height: 12, background: "var(--nt-surface3)", borderRadius: 6, width: "100%", animation: "pulse 1.5s infinite" }} />
                    <div style={{ height: 12, background: "var(--nt-surface3)", borderRadius: 6, width: "90%", animation: "pulse 1.5s infinite 0.2s" }} />
                    <div style={{ height: 12, background: "var(--nt-surface3)", borderRadius: 6, width: "60%", animation: "pulse 1.5s infinite 0.4s" }} />
                </div>
            ) : (
                <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--nt-txt2)", margin: 0 }}>
                    {summary}
                </p>
            )}
            <div style={{ fontSize: 10, color: "var(--nt-txt3)", textAlign: "right", marginTop: 4 }}>
                Powered by Google Gemini
            </div>
        </div>
    );
}
