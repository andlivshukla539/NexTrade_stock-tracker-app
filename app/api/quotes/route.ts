import { NextResponse } from "next/server";
import { getQuote } from "@/lib/actions/finnhub.actions";

const SYMBOLS = ["SPY", "NVDA", "AAPL", "TSLA", "MSFT", "META", "AMZN", "JPM", "GOOG", "AMD", "BTC-USD", "VIX"];

// Cache quotes for 15 seconds to avoid hammering Finnhub on every client poll
export const revalidate = 15;

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const symParam = searchParams.get("symbols");
    const symbols = symParam ? symParam.split(",").map(s => s.trim().toUpperCase()) : SYMBOLS;

    try {
        const results = await Promise.allSettled(
            symbols.map(async (sym) => {
                const price = await getQuote(sym);
                return { symbol: sym, price };
            })
        );

        const quotes: Record<string, number | null> = {};
        results.forEach((r, i) => {
            quotes[symbols[i]] = r.status === "fulfilled" ? r.value.price : null;
        });

        return NextResponse.json({ quotes, timestamp: Date.now() }, {
            headers: { "Cache-Control": "public, s-maxage=15, stale-while-revalidate=30" },
        });
    } catch (err) {
        console.error("Quote API error:", err);
        return NextResponse.json({ error: "Failed to fetch quotes" }, { status: 500 });
    }
}
