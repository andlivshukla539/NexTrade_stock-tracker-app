'use client';

import { useEffect, useRef, useState, useCallback } from "react";

export interface QuoteMap {
    [symbol: string]: number | null;
}

interface Options {
    symbols?: string[];
    intervalMs?: number; // poll interval, default 30s
    enabled?: boolean;
}

/**
 * useMarketQuotes – polls /api/quotes every `intervalMs` ms.
 * Returns live prices, a loading flag, and an error string.
 *
 * Usage:
 *   const { quotes, loading, error, refresh } = useMarketQuotes({ symbols: ["AAPL","NVDA"] });
 */
export function useMarketQuotes({ symbols, intervalMs = 30_000, enabled = true }: Options = {}) {
    const [quotes, setQuotes] = useState<QuoteMap>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const fetch_ = useCallback(async () => {
        try {
            const url = symbols && symbols.length > 0
                ? `/api/quotes?symbols=${symbols.join(",")}`
                : `/api/quotes`;
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            if (data.quotes) {
                setQuotes(data.quotes);
                setError(null);
            }
        } catch (e) {
            console.error("useMarketQuotes fetch error", e);
            setError("Failed to fetch live quotes");
        } finally {
            setLoading(false);
        }
    }, [symbols?.join(",")]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (!enabled) { setLoading(false); return; }

        // Fetch immediately
        fetch_();

        // Then poll on interval
        timerRef.current = setInterval(fetch_, intervalMs);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [fetch_, intervalMs, enabled]);

    return { quotes, loading, error, refresh: fetch_ };
}
