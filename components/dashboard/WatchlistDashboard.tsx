'use client';

import React, { useState, useEffect, useCallback, useContext } from "react";
import { toast } from "sonner";
import { createAlert, removeAlert } from "@/lib/actions/alert.actions";
import { WebSocketContext } from "@/components/realtime/websocket-context";
import { SentimentBadge } from "@/components/ai/SentimentBadge";

// ─── Types ─────────────────────────────────────────────────────────────────
interface Stock { sym: string; full: string; price: string; chg: string; pct: string; up: boolean; col: string; note: string; alert: string | null; }
interface WatchList { title: string; stocks: Stock[]; }
interface AlertItem { id: string; sym: string; cond: string; price: string; status: "active" | "triggered"; }
interface NewsItem { title: string; tag: string; age: string; sentiment: "Bullish" | "Bearish" | "Neutral"; col: string; }

// ─── Static Data (matches HTML reference) ─────────────────────────────────
const DATA: Record<string, WatchList> = {
    tech: {
        title: "⚡ Tech Picks", stocks: [
            { sym: "NVDA", full: "Nvidia Corp", price: "875.40", chg: "+2.31", pct: "+2.31%", up: true, col: "#22C55E", note: "AI leader", alert: "$900.00" },
            { sym: "AAPL", full: "Apple Inc", price: "213.07", chg: "+0.94", pct: "+0.94%", up: true, col: "#94A3B8", note: "Watch $215", alert: "$215.00" },
            { sym: "MSFT", full: "Microsoft Corp", price: "415.32", chg: "+0.69", pct: "+0.69%", up: true, col: "#3B82F6", note: "Copilot cycle", alert: null },
            { sym: "META", full: "Meta Platforms", price: "519.60", chg: "+1.87", pct: "+1.87%", up: true, col: "#0EA5E9", note: "Strong Q4", alert: null },
            { sym: "GOOG", full: "Alphabet Inc", price: "177.23", chg: "+4.01", pct: "+4.01%", up: true, col: "#EF4444", note: "AI catch-up", alert: null },
            { sym: "AMD", full: "AMD Inc", price: "172.80", chg: "-0.58", pct: "-0.58%", up: false, col: "#22C55E", note: "Watch $180", alert: "$180.00" },
            { sym: "TSLA", full: "Tesla Inc", price: "248.50", chg: "-1.22", pct: "-1.22%", up: false, col: "#EF4444", note: "⚠ Alert set", alert: "$240.00" },
        ]
    },
    div: {
        title: "💰 Dividend Kings", stocks: [
            { sym: "JNJ", full: "Johnson & Johnson", price: "158.20", chg: "+0.44", pct: "+0.44%", up: true, col: "#EF4444", note: "Yield 3.1%", alert: null },
            { sym: "KO", full: "Coca-Cola Co", price: "61.84", chg: "+0.32", pct: "+0.32%", up: true, col: "#DC2626", note: "Yield 3.0%", alert: null },
            { sym: "PG", full: "Procter & Gamble", price: "168.40", chg: "+0.21", pct: "+0.21%", up: true, col: "#2563EB", note: "Yield 2.4%", alert: null },
            { sym: "MCD", full: "McDonald's Corp", price: "290.15", chg: "+0.18", pct: "+0.18%", up: true, col: "#F59E0B", note: "Yield 2.3%", alert: null },
        ]
    },
    spec: {
        title: "🚀 Speculative", stocks: [
            { sym: "CDIO", full: "Cardio Diagnostics", price: "2.88", chg: "+28.57", pct: "+28.57%", up: true, col: "#9B6EFF", note: "Biotech play", alert: "$2.50" },
            { sym: "OPEN", full: "Opendoor Tech", price: "5.00", chg: "+7.53", pct: "+7.53%", up: true, col: "#0EA5E9", note: "High risk", alert: null },
            { sym: "ONDS", full: "Ondas Inc", price: "10.03", chg: "-11.94", pct: "-11.94%", up: false, col: "#EF4444", note: "Stop at $9", alert: "$9.00" },
        ]
    },
};

const INIT_ALERTS: AlertItem[] = [
    { id: "demo_1", sym: "NVDA", cond: "Price above", price: "$900.00", status: "active" },
    { id: "demo_2", sym: "TSLA", cond: "Price below", price: "$240.00", status: "triggered" },
    { id: "demo_3", sym: "ORCL", cond: "Price below", price: "$150.00", status: "triggered" },
    { id: "demo_4", sym: "AAPL", cond: "Price above", price: "$215.00", status: "active" },
    { id: "demo_5", sym: "CDIO", cond: "Price above", price: "$2.50", status: "triggered" },
];

const NEWS_DATA: NewsItem[] = [
    { title: "NVIDIA beats Q4 estimates, raises full-year guidance on surging AI chip demand", tag: "NVDA", age: "8m", sentiment: "Bullish", col: "var(--nt-green)" },
    { title: "Alphabet surges after YouTube ad revenue beat and AI-powered search momentum", tag: "GOOG", age: "22m", sentiment: "Bullish", col: "var(--nt-green)" },
    { title: "Tesla misses Q4 deliveries forecast; Cybertruck ramp on track for 2026", tag: "TSLA", age: "35m", sentiment: "Bearish", col: "var(--nt-red)" },
    { title: "Apple gains as institutional buyers accumulate ahead of WWDC product keynote", tag: "AAPL", age: "51m", sentiment: "Neutral", col: "var(--nt-blue)" },
    { title: "AMD launches MI350 GPU lineup, directly challenging NVIDIA in datacenter segment", tag: "AMD", age: "1h", sentiment: "Bullish", col: "var(--nt-green)" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function Sparkline({ up, seed = 0 }: { up: boolean; seed?: number }) {
    const pts: { x: number; y: number }[] = [];
    let y = up ? 22 : 8;
    for (let i = 0; i < 10; i++) {
        const r = Math.abs(Math.sin(seed * 73.1 + i * 149.3 + 47.7)) % 1;
        y += (r - 0.38) * (up ? -4 : 4);
        y = Math.max(2, Math.min(28, y));
        pts.push({ x: (i * 64) / 9, y });
    }
    const line = pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
    const fill = pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ") + ` 64,30 0,30`;
    const col = up ? "#00E5A0" : "#FF4D6D";
    return (
        <svg width="64" height="30" viewBox="0 0 64 30" preserveAspectRatio="none">
            <polyline points={fill} fill={col + "22"} stroke="none" />
            <polyline points={line} fill="none" stroke={col} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
    );
}

// ─── Reusable styled elements ─────────────────────────────────────────────────
const S = {
    card: { background: "var(--nt-surface)", border: "1px solid var(--nt-border)", borderRadius: 16, overflow: "hidden" as const },
    cardHead: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: "1px solid var(--nt-border)", gap: 10, flexWrap: "wrap" as const },
    pill: (col: string) => ({ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 9px", borderRadius: 100, background: col + "18", border: `1px solid ${col}30`, fontSize: 9.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: col }),
    tabGroup: { display: "flex", background: "var(--nt-surface2)", borderRadius: 9, padding: 3, gap: 2 },
    btn: (gold?: boolean) => ({
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "8px 16px", borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: "pointer",
        transition: "all 0.15s",
        background: gold ? "var(--nt-gold)" : "var(--nt-surface2)",
        border: `1px solid ${gold ? "var(--nt-gold)" : "var(--nt-border)"}`,
        color: gold ? "#080810" : "var(--nt-txt2)",
        fontFamily: "var(--font-syne)",
    } as React.CSSProperties),
} as const;

function LivePill() {
    return (
        <span style={S.pill("var(--nt-green)")}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--nt-green)", animation: "pulse 1.4s ease-in-out infinite", display: "inline-block" }} />
            LIVE
        </span>
    );
}

function Tab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
        <button onClick={onClick} style={{
            padding: "4px 12px", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer",
            background: active ? "var(--nt-surface3)" : "none", color: active ? "var(--nt-txt)" : "var(--nt-txt3)",
            border: "none", fontFamily: "var(--font-syne)", transition: "all 0.15s",
        }}>{label}</button>
    );
}


// ─── Main Component ────────────────────────────────────────────────────────────
export default function WatchlistDashboard({
    realSymbols = [],
    initialAlerts = []
}: {
    realSymbols?: { symbol: string; company: string; listName?: string }[],
    initialAlerts?: { id: string, symbol: string, condition: string, targetPrice: number, status: "active" | "triggered" }[]
}) {
    const hasReal = realSymbols.length > 0;

    // Group symbols by listName for real DB entries
    const SYMBOL_COLORS = ["#22C55E", "#3B82F6", "#E8C547", "#EF4444", "#9B6EFF", "#0EA5E9", "#F59E0B", "#DC2626", "#94A3B8", "#06B6D4"];
    const realLists: Record<string, WatchList> = {};
    if (hasReal) {
        realSymbols.forEach((item, i) => {
            const ln = item.listName || "My Watchlist";
            const key = `__real__${ln}`; // Prefix for styling hooks
            if (!realLists[key]) {
                realLists[key] = { title: `⭐ ${ln}`, stocks: [] };
            }
            realLists[key].stocks.push({
                sym: item.symbol,
                full: item.company || item.symbol,
                price: "—", chg: "0", pct: "0%", up: true,
                col: SYMBOL_COLORS[i % SYMBOL_COLORS.length],
                note: "", alert: null,
            });
        });
    }

    const firstRealKey = hasReal ? Object.keys(realLists)[0] : "tech";
    const [listKey, setListKey] = useState<string>(firstRealKey);
    const [stockTab, setStockTab] = useState("All");
    const [alertTab, setAlertTab] = useState("All");
    const [filter, setFilter] = useState("");

    const mappedInitialAlerts: AlertItem[] = initialAlerts.length > 0
        ? initialAlerts.map(a => ({
            id: a.id,
            sym: a.symbol,
            cond: a.condition,
            price: `$${a.targetPrice.toFixed(2)}`,
            status: a.status
        }))
        : INIT_ALERTS;

    const [alerts, setAlerts] = useState<AlertItem[]>(mappedInitialAlerts);
    const [showBanner, setShowBanner] = useState(true);
    const [newSym, setNewSym] = useState("");
    const [newCond, setNewCond] = useState("Price Above");
    const [newTarget, setNewTarget] = useState("");
    const [newFreq, setNewFreq] = useState("Once");

    const [customLists, setCustomLists] = useState<Record<string, WatchList>>({});

    const allLists: Record<string, WatchList> = {
        ...realLists,
        ...DATA,
        ...customLists
    };

    const list = allLists[listKey] ?? allLists[Object.keys(allLists)[0]];

    // Action Handlers
    function handleImportCSV() {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".csv";
        input.onchange = () => { toast.success(`Imported 12 symbols from CSV`); };
        input.click();
    }

    function scrollToAlerts() {
        document.getElementById("price-alerts-section")?.scrollIntoView({ behavior: "smooth" });
        setAlertTab("All");
    }

    function createNewList() {
        const name = prompt("Enter a name for your new watchlist:", "My Custom List 2");
        if (!name) return;
        const key = `custom_${Date.now()}`;
        setCustomLists(prev => ({
            ...prev,
            [key]: { title: `📋 ${name}`, stocks: [] }
        }));
        setListKey(key);
        toast.success(`Created list: ${name}`);
    }

    // Live price updates via WebSockets and Fallback API
    const wsContext = useContext(WebSocketContext);
    const [prices, setPrices] = useState<Record<string, number>>({});

    // Fallback polling
    const fetchPrices = useCallback(async () => {
        try {
            const syms = list.stocks.map((s: Stock) => s.sym).join(",");
            if (!syms) return;
            const res = await fetch(`/api/quotes?symbols=${syms}`);
            if (res.ok) { const d = await res.json(); setPrices(prev => ({ ...prev, ...(d.quotes || {}) })); }
        } catch { /* silent */ }
    }, [listKey, realSymbols.length]); // eslint-disable-line react-hooks/exhaustive-deps

    // Extract stable subscribe/unsubscribe refs — these are useCallback with []
    // so their identity never changes, unlike the full wsContext object which
    // gets a new reference on every latestPrices update (every WS tick).
    const wsSubscribe = wsContext?.subscribe;
    const wsUnsubscribe = wsContext?.unsubscribe;

    useEffect(() => {
        if (!wsSubscribe) return;
        const stocks = list.stocks;
        stocks.forEach((s: Stock) => wsSubscribe(s.sym));
        return () => {
            stocks.forEach((s: Stock) => wsUnsubscribe?.(s.sym));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listKey, wsSubscribe, wsUnsubscribe]);


    useEffect(() => { fetchPrices(); const t = setInterval(fetchPrices, 30000); return () => clearInterval(t); }, [fetchPrices]);

    const visibleStocks = list.stocks
        .filter((s: Stock) => {
            if (filter && !`${s.sym} ${s.full}`.toLowerCase().includes(filter.toLowerCase())) return false;
            if (stockTab === "Gainers") return s.up;
            if (stockTab === "Losers") return !s.up;
            return true;
        });

    const visibleAlerts = alerts.filter(a => {
        if (alertTab === "Active") return a.status === "active";
        if (alertTab === "Triggered") return a.status === "triggered";
        return true;
    });

    async function handleAddAlert() {
        if (!newSym || !newTarget) { toast.error("Fill in symbol and target price"); return; }
        try {
            const targetVal = parseFloat(newTarget);
            const res = await createAlert({
                symbol: newSym,
                condition: newCond,
                targetPrice: targetVal,
                frequency: newFreq
            });
            if (res.ok) {
                const item: AlertItem = { id: res.alertId, sym: newSym.toUpperCase(), cond: newCond, price: `$${targetVal.toFixed(2)}`, status: "active" };
                setAlerts(prev => [item, ...prev]);
                setNewSym(""); setNewTarget("");
                toast.success(`Alert set for ${newSym.toUpperCase()}`);
            }
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Failed to set alert");
        }
    }

    async function handleRemoveAlert(id: string) {
        if (id.startsWith("demo_")) {
            setAlerts(prev => prev.filter(a => a.id !== id));
            return;
        }
        try {
            await removeAlert(id);
            setAlerts(prev => prev.filter(a => a.id !== id));
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Failed to remove alert");
        }
    }

    // Merge WebSocket live prices over polled API prices
    const mergedPrices = {
        ...prices,
        ...(wsContext ? Object.fromEntries(
            Object.entries(wsContext.latestPrices).map(([k, v]: [string, { price: number }]) => [k, v.price])
        ) : {})
    };

    // Compute KPIs from live prices where available, falling back to static data
    const enrichedStocks = list.stocks.map((s: Stock) => {
        const live = mergedPrices[s.sym];
        const staticPrice = parseFloat(s.price);
        if (live && !isNaN(staticPrice) && staticPrice > 0) {
            const diffPct = ((live - staticPrice) / staticPrice) * 100;
            return { ...s, liveUp: live >= staticPrice, livePct: diffPct };
        }
        return { ...s, liveUp: s.up, livePct: parseFloat(s.pct) };
    });
    const gainers = enrichedStocks.filter((s: { liveUp: boolean }) => s.liveUp);
    const losers = enrichedStocks.filter((s: { liveUp: boolean }) => !s.liveUp);
    const liveTotal = list.stocks.reduce((sum: number, s: Stock) => {
        const p = mergedPrices[s.sym];
        return sum + (p ?? parseFloat(s.price) ?? 0);
    }, 0);

    const kpi = {
        value: liveTotal > 0 ? `$${liveTotal.toLocaleString("en-US", { maximumFractionDigits: 0 })}` : (hasReal && listKey.startsWith("__real__") ? "—" : "$48,210"),
        valueChg: "",
        gainers: gainers.length,
        bestGainer: gainers.sort((a, b) => b.livePct - a.livePct)[0],
        losers: losers.length,
        worstLoser: losers.sort((a, b) => a.livePct - b.livePct)[0],
        alertCount: alerts.filter(a => a.status === "active").length,
    };

    const inputStyle: React.CSSProperties = {
        padding: "8px 12px", background: "var(--nt-surface2)", border: "1px solid var(--nt-border)",
        borderRadius: 10, fontSize: 12.5, color: "var(--nt-txt)", fontFamily: "var(--font-syne)",
        outline: "none", transition: "border-color 0.15s",
    };
    const selectStyle: React.CSSProperties = { ...inputStyle, cursor: "pointer", WebkitAppearance: "none" };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 18, fontFamily: "var(--font-syne)" }}>

            {/* Page Header */}
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
                <div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--nt-txt3)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6 }}>
                        {Object.keys(allLists).length} lists · {Object.values(allLists).flatMap(d => d.stocks).length} symbols · live
                    </div>
                    <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: 30, fontWeight: 900, lineHeight: 1, letterSpacing: "-0.02em", color: "var(--nt-txt)" }}>
                        Your <em style={{ color: "var(--nt-gold)", fontStyle: "italic" }}>Watchlist</em>
                    </h1>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button style={S.btn()} onClick={handleImportCSV}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                        Import CSV
                    </button>
                    <button onClick={scrollToAlerts} style={S.btn()}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
                        Manage Alerts
                    </button>
                    <button style={S.btn(true)} onClick={createNewList}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                        New List
                    </button>
                </div>
            </div>

            {/* KPI Strip */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
                {[
                    { label: "Watchlist Value", val: kpi.value, sub: <span style={{ color: "var(--nt-green)", fontFamily: "var(--font-mono)", fontSize: 11 }}>▲ {kpi.valueChg}</span>, accent: "var(--nt-gold)", icon: "$" },
                    { label: "Gainers Today", val: kpi.gainers, sub: <span style={{ color: "var(--nt-green)", fontFamily: "var(--font-mono)", fontSize: 11 }}>Best: {kpi.bestGainer?.sym} {kpi.bestGainer?.pct}</span>, accent: "var(--nt-green)", icon: "↗" },
                    { label: "Losers Today", val: kpi.losers, sub: <span style={{ color: "var(--nt-red)", fontFamily: "var(--font-mono)", fontSize: 11 }}>Worst: {kpi.worstLoser?.sym} {kpi.worstLoser?.pct}</span>, accent: "var(--nt-red)", icon: "↘" },
                    { label: "Active Alerts", val: kpi.alertCount, sub: <span style={{ color: "var(--nt-txt3)", fontFamily: "var(--font-mono)", fontSize: 11 }}>{alerts.filter(a => a.status === "triggered").length} triggered today</span>, accent: "var(--nt-gold)", icon: "🔔" },
                ].map((k, i) => (
                    <div key={i} style={{ ...S.card, padding: 16, position: "relative", overflow: "hidden", transition: "transform 0.2s, border-color 0.2s", cursor: "default" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--nt-border2)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.borderColor = "var(--nt-border)"; }}
                    >
                        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1.5, background: k.accent, opacity: 0.7 }} />
                        <div style={{ position: "absolute", bottom: -30, right: -30, width: 90, height: 90, borderRadius: "50%", background: k.accent, opacity: 0.06, filter: "blur(25px)" }} />
                        <div style={{ width: 30, height: 30, borderRadius: 8, background: k.accent + "20", color: k.accent, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10, fontSize: 14, fontWeight: 700 }}>{k.icon}</div>
                        <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--nt-txt3)", marginBottom: 5 }}>{k.label}</div>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 22, fontWeight: 700, color: k.accent, marginBottom: 3 }}>{k.val}</div>
                        {k.sub}
                    </div>
                ))}
            </div>

            {/* Alert Banner */}
            {showBanner && (
                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "var(--nt-red-dim)", border: "1px solid rgba(255,77,109,0.2)", borderRadius: 16 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 9, background: "rgba(255,77,109,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--nt-red)" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                    </div>
                    <div style={{ flex: 1, fontSize: 12.5, fontWeight: 500, color: "var(--nt-txt2)" }}>
                        <strong style={{ color: "var(--nt-red)" }}>{alerts.filter(a => a.status === "triggered").length} price alerts triggered</strong>
                        {" — TSLA breached $240, ORCL dropped below $150, CDIO spiked above $2.50"}
                    </div>
                    <button style={S.btn()} onClick={() => setAlertTab("Triggered")}>View All</button>
                    <button onClick={() => setShowBanner(false)} style={{ width: 26, height: 26, borderRadius: 6, background: "none", border: "none", color: "var(--nt-txt3)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                </div>
            )}

            {/* Content Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 14, alignItems: "start" }}>

                {/* ── List Picker ── */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--nt-txt3)", marginBottom: 4 }}>My Lists</div>

                    {(Object.entries(allLists) as [string, WatchList][]).map(([k, wl]) => {
                        const isActive = listKey === k;
                        const IS_REAL = k.startsWith("__real__");
                        const TAGS: Record<string, string[]> = { tech: ["FAANG", "AI", "Semis"], div: ["Dividend", "Value"], spec: ["Small Cap", "Biotech"] };
                        const META: Record<string, string> = { tech: "7 stocks · Demo", div: "4 stocks · Demo", spec: "3 stocks · Demo" };
                        return (
                            <div key={k} onClick={() => setListKey(k)}
                                style={{ background: isActive ? "var(--nt-gold-dim)" : "var(--nt-surface)", border: `1px solid ${isActive ? "rgba(232,197,71,0.35)" : "var(--nt-border)"}`, borderRadius: 16, padding: 14, cursor: "pointer", position: "relative", overflow: "hidden", transition: "all 0.2s" }}
                            >
                                {isActive && <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 3, background: "linear-gradient(180deg,var(--nt-gold),var(--nt-gold2))", borderRadius: "3px 0 0 3px" }} />}
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                                    <span style={{ fontSize: 13, fontWeight: 700, paddingLeft: isActive ? 6 : 0 }}>{wl.title}</span>
                                    {IS_REAL
                                        ? <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, fontWeight: 700, padding: "2px 8px", borderRadius: 100, background: "var(--nt-green-dim)", color: "var(--nt-green)" }}>{wl.stocks.length} stocks</span>
                                        : <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, padding: "2px 8px", borderRadius: 100, background: "var(--nt-surface3)", color: "var(--nt-txt3)" }}>demo</span>
                                    }
                                </div>
                                <div style={{ fontSize: 11, color: "var(--nt-txt3)", marginBottom: IS_REAL ? 0 : 8, paddingLeft: isActive ? 6 : 0 }}>
                                    {IS_REAL ? `${wl.stocks.length} symbol${wl.stocks.length !== 1 ? "s" : ""} · live prices` : META[k]}
                                </div>
                                {!IS_REAL && (
                                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap", paddingLeft: isActive ? 6 : 0 }}>
                                        {TAGS[k]?.map(t => <span key={t} style={{ fontSize: 9.5, padding: "2px 8px", borderRadius: 100, background: "var(--nt-surface3)", color: "var(--nt-txt3)", fontWeight: 600 }}>{t}</span>)}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    <button onClick={createNewList} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, width: "100%", padding: 11, borderRadius: 10, border: "1px dashed var(--nt-border2)", background: "none", color: "var(--nt-txt3)", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-syne)", transition: "all 0.2s" }}
                        onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = "var(--nt-gold-glow)"; el.style.color = "var(--nt-gold)"; el.style.background = "var(--nt-gold-dim)"; }}
                        onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = "var(--nt-border2)"; el.style.color = "var(--nt-txt3)"; el.style.background = "none"; }}
                    >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                        Create New Watchlist
                    </button>

                    {/* Mini perf card */}
                    <div style={{ ...S.card, marginTop: 4 }}>
                        <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--nt-border)", display: "flex", alignItems: "center", gap: 7, fontSize: 11.5, fontWeight: 700 }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--nt-gold)", boxShadow: "0 0 6px var(--nt-gold-glow)", display: "inline-block" }} />
                            Today&apos;s Performance
                        </div>
                        <div style={{ padding: "10px 14px 12px", display: "flex", flexDirection: "column", gap: 7 }}>
                            {list.stocks.slice(0, 6).map(s => {
                                const abs = Math.abs(parseFloat(s.pct));
                                const w = Math.min(100, abs * (s.sym === "CDIO" ? 2 : 12));
                                return (
                                    <div key={s.sym} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, fontWeight: 600, width: 38, color: "var(--nt-txt2)" }}>{s.sym}</div>
                                        <div style={{ flex: 1, height: 5, background: "var(--nt-surface3)", borderRadius: 5, overflow: "hidden" }}>
                                            <div style={{ height: "100%", width: `${w}%`, borderRadius: 5, background: s.up ? "var(--nt-green)" : "var(--nt-red)", transition: "width 0.8s ease" }} />
                                        </div>
                                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, fontWeight: 600, width: 50, textAlign: "right", color: s.up ? "var(--nt-green)" : "var(--nt-red)" }}>{s.pct}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* ── Right Panel ── */}
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

                    {/* ── Stock Table ── */}
                    <div style={S.card}>
                        <div style={S.cardHead}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 700 }}>
                                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--nt-gold)", boxShadow: "0 0 7px var(--nt-gold-glow)", display: "inline-block" }} />
                                {list.title}
                                <LivePill />
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "6px 12px", background: "var(--nt-surface2)", border: "1px solid var(--nt-border)", borderRadius: 10 }}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--nt-txt3)" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                                    <input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Filter…" style={{ background: "none", border: "none", fontSize: 11.5, color: "var(--nt-txt2)", outline: "none", width: 100, fontFamily: "var(--font-syne)" }} />
                                </div>
                                <div style={S.tabGroup}>
                                    {["All", "Gainers", "Losers"].map(t => <Tab key={t} label={t} active={stockTab === t} onClick={() => setStockTab(t)} />)}
                                </div>
                                <button style={{ ...S.btn(), fontSize: 11, padding: "6px 12px" }}>+ Add Symbol</button>
                            </div>
                        </div>

                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr>
                                        {["Symbol", "Price", "Change", "Chg %", "7D", "Alert", "Note", "Actions"].map((h, i) => (
                                            <th key={h} style={{ padding: "10px 16px", textAlign: i > 0 ? "right" : "left", fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--nt-txt3)", borderBottom: "1px solid var(--nt-border)", whiteSpace: "nowrap" }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {visibleStocks.map((s, i) => {
                                        const live = prices[s.sym];
                                        const displayPrice = live ? `$${live.toFixed(2)}` : (s.price !== "—" ? s.price : "Loading…");
                                        return (
                                            <tr key={s.sym}
                                                style={{ borderBottom: "1px solid var(--nt-border)", cursor: "pointer", transition: "background 0.12s" }}
                                                onMouseEnter={e => (e.currentTarget.style.background = "var(--nt-surface2)")}
                                                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                                            >
                                                <td style={{ padding: "11px 16px" }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                        <div style={{ width: 34, height: 34, borderRadius: 10, background: s.col + "18", color: s.col, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: 10.5, fontWeight: 700, flexShrink: 0 }}>{s.sym.slice(0, 2)}</div>
                                                        <div>
                                                            <div style={{ fontSize: 13, fontWeight: 700 }}>{s.sym}</div>
                                                            <div style={{ fontSize: 10.5, color: "var(--nt-txt3)" }}>{s.full}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ padding: "11px 16px", textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 13 }}>{displayPrice}</td>
                                                <td style={{ padding: "11px 16px", textAlign: "right" }}>
                                                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 9px", borderRadius: 7, fontFamily: "var(--font-mono)", fontSize: 11.5, fontWeight: 600, background: s.up ? "var(--nt-green-dim)" : "var(--nt-red-dim)", color: s.up ? "var(--nt-green)" : "var(--nt-red)" }}>
                                                        {s.up ? "▲" : "▼"} {s.chg}
                                                    </span>
                                                </td>
                                                <td style={{ padding: "11px 16px", textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 12, color: s.up ? "var(--nt-green)" : "var(--nt-red)" }}>{s.pct}</td>
                                                <td style={{ padding: "11px 16px", textAlign: "right" }}><Sparkline up={s.up} seed={i * 17 + 3} /></td>
                                                <td style={{ padding: "11px 16px", textAlign: "right" }}>
                                                    {s.alert
                                                        ? <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 6, background: "var(--nt-gold-dim)", color: "var(--nt-gold)", border: "1px solid rgba(232,197,71,0.2)" }}>🔔 {s.alert}</span>
                                                        : <button onClick={() => { setNewSym(s.sym); toast.info("Set target price in the alerts form below"); }} style={{ display: "inline-flex", alignItems: "center", gap: 4, fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 6, background: "var(--nt-surface2)", color: "var(--nt-txt3)", border: "1px solid var(--nt-border)", cursor: "pointer" }}>+ Set</button>
                                                    }
                                                </td>
                                                <td style={{ padding: "11px 16px", textAlign: "right", fontSize: 11, color: "var(--nt-txt3)", maxWidth: 100 }}>{s.note}</td>
                                                <td style={{ padding: "11px 16px", textAlign: "right" }}>
                                                    <div style={{ display: "flex", gap: 6, alignItems: "center", justifyContent: "flex-end" }}>
                                                        {[
                                                            { label: "Buy", bg: "var(--nt-green-dim)", col: "var(--nt-green)", fn: () => toast.success(`Buy ${s.sym}`) },
                                                            { label: "Sell", bg: "var(--nt-red-dim)", col: "var(--nt-red)", fn: () => toast.error(`Sell ${s.sym}`) },
                                                            { label: "✕", bg: "var(--nt-surface3)", col: "var(--nt-txt3)", fn: () => toast.info(`Remove ${s.sym}`) },
                                                        ].map(b => (
                                                            <button key={b.label} onClick={b.fn} style={{ padding: "4px 10px", borderRadius: 6, fontSize: 10.5, fontWeight: 700, cursor: "pointer", border: "none", background: b.bg, color: b.col, fontFamily: "var(--font-syne)", transition: "filter 0.12s" }}
                                                                onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1.3)")}
                                                                onMouseLeave={e => (e.currentTarget.style.filter = "")}
                                                            >{b.label}</button>
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* ── Price Alerts ── */}
                    <div id="price-alerts-section" style={S.card}>
                        <div style={S.cardHead}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 700 }}>
                                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--nt-gold)", display: "inline-block" }} />
                                Price Alerts
                            </div>
                            <div style={S.tabGroup}>
                                {["All", "Active", "Triggered"].map(t => <Tab key={t} label={t} active={alertTab === t} onClick={() => setAlertTab(t)} />)}
                            </div>
                        </div>

                        {/* Alert form */}
                        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, padding: "14px 18px", borderBottom: "1px solid var(--nt-border)", flexWrap: "wrap" }}>
                            {[
                                { label: "Symbol", el: <input value={newSym} onChange={e => setNewSym(e.target.value)} placeholder="e.g. AAPL" style={{ ...inputStyle, width: 110 }} /> },
                                {
                                    label: "Condition", el: (
                                        <div style={{ position: "relative" }}>
                                            <select value={newCond} onChange={e => setNewCond(e.target.value)} style={{ ...selectStyle, width: 130, paddingRight: 28 }}>
                                                {["Price Above", "Price Below", "Crosses Up", "Crosses Down", "% Change >"].map(c => <option key={c}>{c}</option>)}
                                            </select>
                                            <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "var(--nt-txt3)", fontSize: 11, pointerEvents: "none" }}>▾</span>
                                        </div>
                                    )
                                },
                                { label: "Target ($)", el: <input type="number" value={newTarget} onChange={e => setNewTarget(e.target.value)} placeholder="0.00" style={{ ...inputStyle, width: 110 }} /> },
                                {
                                    label: "Frequency", el: (
                                        <div style={{ position: "relative" }}>
                                            <select value={newFreq} onChange={e => setNewFreq(e.target.value)} style={{ ...selectStyle, width: 110, paddingRight: 28 }}>
                                                {["Once", "Every Time"].map(f => <option key={f}>{f}</option>)}
                                            </select>
                                            <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "var(--nt-txt3)", fontSize: 11, pointerEvents: "none" }}>▾</span>
                                        </div>
                                    )
                                },
                            ].map(f => (
                                <div key={f.label} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--nt-txt3)" }}>{f.label}</div>
                                    {f.el}
                                </div>
                            ))}
                            <button onClick={handleAddAlert} style={{ ...S.btn(true), alignSelf: "flex-end" }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                Set Alert
                            </button>
                        </div>

                        {/* Active alerts list */}
                        <div style={{ padding: "4px 18px 14px" }}>
                            {visibleAlerts.length === 0 ? (
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 28, color: "var(--nt-txt3)", gap: 8 }}>
                                    <span style={{ fontSize: 28, opacity: 0.4 }}>🔔</span>
                                    <span style={{ fontSize: 12 }}>No {alertTab !== "All" ? alertTab.toLowerCase() : ""} alerts</span>
                                </div>
                            ) : visibleAlerts.map((a, i) => (
                                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: i < visibleAlerts.length - 1 ? "1px solid var(--nt-border)" : "none" }}>
                                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, width: 46, flexShrink: 0, color: "var(--nt-txt)" }}>{a.sym}</div>
                                    <div style={{ fontSize: 12, fontWeight: 500, color: "var(--nt-txt2)", flex: 1 }}>{a.cond}</div>
                                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700, color: "var(--nt-gold)" }}>{a.price}</div>
                                    <span style={{ fontSize: 9.5, fontWeight: 700, padding: "2px 8px", borderRadius: 5, background: a.status === "active" ? "var(--nt-green-dim)" : "var(--nt-red-dim)", color: a.status === "active" ? "var(--nt-green)" : "var(--nt-red)", whiteSpace: "nowrap" }}>
                                        {a.status === "active" ? "● Active" : "▲ Triggered"}
                                    </span>
                                    <button onClick={() => handleRemoveAlert(a.id)} style={{ width: 24, height: 24, borderRadius: 6, background: "none", border: "none", color: "var(--nt-txt3)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}
                                        onMouseEnter={e => { const el = e.currentTarget; el.style.background = "var(--nt-red-dim)"; el.style.color = "var(--nt-red)"; }}
                                        onMouseLeave={e => { const el = e.currentTarget; el.style.background = "none"; el.style.color = "var(--nt-txt3)"; }}
                                    >
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Related News ── */}
                    <div style={S.card}>
                        <div style={S.cardHead}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 700 }}>
                                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--nt-green)", display: "inline-block" }} />
                                Related News
                            </div>
                            <LivePill />
                        </div>
                        {NEWS_DATA.map((n, i) => (
                            <div key={i} style={{ display: "flex", gap: 12, padding: "12px 18px", borderBottom: i < NEWS_DATA.length - 1 ? "1px solid var(--nt-border)" : "none", cursor: "pointer", transition: "background 0.12s" }}
                                onMouseEnter={e => (e.currentTarget.style.background = "var(--nt-surface2)")}
                                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                            >
                                <div style={{ width: 3, borderRadius: 3, background: n.col, flexShrink: 0, alignSelf: "stretch", minHeight: 40 }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.5, marginBottom: 5, color: "var(--nt-txt)" }}>{n.title}</div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 5, background: n.col + "20", color: n.col }}>{n.tag}</span>
                                        <span style={{ fontSize: 10, color: "var(--nt-txt3)" }}>{n.age} ago</span>
                                        <SentimentBadge headline={n.title} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}
