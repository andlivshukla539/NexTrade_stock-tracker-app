'use client';

import Image from "next/image";
import Link from "next/link";
import SearchCommand from "@/components/SearchCommand";
import UserDropdown from "@/components/UserDropdown";
import { useMarketQuotes } from "@/hooks/useMarketQuotes";

// Static baseline prices + symbols shown in ticker
const STATIC_TICKS = [
    { sym: "AMD", base: 172.80, up: false },
    { sym: "GOOG", base: 177.23, up: true },
    { sym: "META", base: 519.60, up: true },
    { sym: "AMZN", base: 191.05, up: true },
    { sym: "BTC", base: 67248, up: true },
    { sym: "JPM", base: 318.79, up: true },
    { sym: "VIX", base: 13.47, up: false },
    { sym: "NVDA", base: 875.40, up: true },
    { sym: "AAPL", base: 213.87, up: true },
    { sym: "TSLA", base: 248.50, up: false },
    { sym: "MSFT", base: 415.32, up: true },
    { sym: "SPY", base: 538.91, up: true },
];

const SYMS = STATIC_TICKS.filter(t => t.sym !== "BTC" && t.sym !== "VIX").map(t => t.sym);

function fmt(p: number) {
    return p > 1000 ? p.toLocaleString("en-US", { maximumFractionDigits: 0 }) : p.toFixed(2);
}

export default function TopNav({ user, initialStocks }: { user: User; initialStocks: StockWithWatchlistStatus[] }) {
    // Poll live quotes every 30 s — falls back to base prices if unavailable
    const { quotes } = useMarketQuotes({ symbols: SYMS, intervalMs: 30_000 });

    const ticks = STATIC_TICKS.map(t => {
        const live = quotes[t.sym];
        const price = live ?? t.base;
        const chg = live ? ((live - t.base) / t.base) * 100 : 0;
        const up = live ? live >= t.base : t.up;
        return { sym: t.sym, price, chg, up };
    });

    return (
        <div style={{
            display: "flex", alignItems: "center",
            height: 44, flexShrink: 0, overflow: "hidden",
            background: "#0D0D10",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            position: "sticky", top: 0, zIndex: 200,
        }}>
            {/* Brand */}
            <Link href="/" style={{
                width: 200, flexShrink: 0,
                display: "flex", alignItems: "center",
                padding: "0 14px",
                borderRight: "1px solid rgba(255,255,255,0.07)",
                height: "100%", textDecoration: "none",
            }}>
                <Image src="/assets/icons/logo.svg" alt="NexTrade" width={100} height={22} style={{ height: 22, width: "auto" }} />
                <span style={{
                    marginLeft: 7, fontSize: 10, fontWeight: 700,
                    padding: "1px 5px", borderRadius: 4,
                    background: "rgba(46,204,138,0.15)", color: "#2ECC8A",
                    fontFamily: "'JetBrains Mono',monospace",
                }}>LIVE</span>
            </Link>

            {/* Scrolling live ticker */}
            <div style={{ flex: 1, overflow: "hidden", height: "100%", display: "flex", alignItems: "center" }}>
                <div style={{ display: "flex", animation: "ticker 44s linear infinite", whiteSpace: "nowrap" }}>
                    {[...ticks, ...ticks].map((t, i) => (
                        <span key={i} style={{
                            display: "inline-flex", alignItems: "center", gap: 6,
                            padding: "0 16px",
                            borderRight: "1px solid rgba(255,255,255,0.05)",
                            fontFamily: "'JetBrains Mono',monospace", fontSize: 11,
                        }}>
                            <span style={{ color: "#5A5865" }}>{t.sym}</span>
                            <span style={{ color: "#C8C6D2" }}>{fmt(t.price)}</span>
                            <span style={{ color: t.up ? "#2ECC8A" : "#F0524F" }}>
                                {t.chg >= 0 ? "+" : ""}{t.chg.toFixed(2)}%
                            </span>
                        </span>
                    ))}
                </div>
            </div>

            {/* Right actions */}
            <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "0 12px", flexShrink: 0, borderLeft: "1px solid rgba(255,255,255,0.07)" }}>
                <SearchCommand renderAs="button" label="Search" initialStocks={initialStocks} />
                <Link href="/alerts" aria-label="Alerts" style={{
                    width: 30, height: 30, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.08)",
                    background: "#131316", display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", position: "relative", flexShrink: 0,
                }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9896A0" strokeWidth="1.8" strokeLinecap="round">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                    <span style={{
                        position: "absolute", top: 5, right: 5, width: 6, height: 6,
                        background: "#F0524F", borderRadius: "50%",
                        border: "1.5px solid #0D0D10",
                    }} />
                </Link>
                <UserDropdown user={user} initialStocks={initialStocks} />
            </div>
        </div>
    );
}
