'use client';

import React, { useState, useEffect, useCallback, useContext, useMemo } from "react";
import { toast } from "sonner";
import { createAlert, removeAlert } from "@/lib/actions/alert.actions";
import { removeFromWatchlist } from "@/lib/actions/watchlist.actions";
import { SentimentBadge } from "@/components/ai/SentimentBadge";
import { useMarketQuotes } from "@/hooks/useMarketQuotes";
import { Loader2 } from "lucide-react";

interface RealSymbol { symbol: string; company: string; listName: string; }
interface AlertItem { id: string; symbol: string; condition: string; targetPrice: number; status: "active" | "triggered"; }
interface NewsItem { title: string; tag: string; age: string; sentiment: "Bullish" | "Bearish" | "Neutral"; col: string; }

// Fallback empty news for now, or we can fetch it via API
const NEWS_DATA: NewsItem[] = [
    { title: "NVIDIA beats Q4 estimates, raises full-year guidance", tag: "NVDA", age: "8m", sentiment: "Bullish", col: "var(--nt-green)" },
    { title: "Alphabet surges after YouTube ad revenue beat", tag: "GOOG", age: "22m", sentiment: "Bullish", col: "var(--nt-green)" },
    { title: "Tesla misses Q4 deliveries forecast", tag: "TSLA", age: "35m", sentiment: "Bearish", col: "var(--nt-red)" }
];

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
            <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--nt-green)", display: "inline-block", boxShadow: "0 0 6px var(--nt-green)", animation: "pulse 2s infinite" }} />
            Live
        </span>
    );
}

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

export default function WatchlistDashboard({
    realSymbols = [],
    initialAlerts = []
}: {
    realSymbols: RealSymbol[],
    initialAlerts: AlertItem[]
}) {
    const lists = useMemo(() => {
        const acc: Record<string, RealSymbol[]> = {};
        realSymbols.forEach(s => {
            const listName = s.listName || "My Watchlist";
            if (!acc[listName]) acc[listName] = [];
            acc[listName].push(s);
        });
        if (Object.keys(acc).length === 0) acc["My Watchlist"] = [];
        return acc;
    }, [realSymbols]);

    const tabKeys = Object.keys(lists);
    const [tab, setTab] = useState(tabKeys[0] || "My Watchlist");
    const [alerts, setAlerts] = useState<AlertItem[]>(initialAlerts);
    const [alertTab, setAlertTab] = useState<"All" | "Active" | "Triggered">("All");

    const activeList = lists[tab] || [];
    const activeSymbols = activeList.map(s => s.symbol);

    const { quotes, loading } = useMarketQuotes({ symbols: activeSymbols });

    const [newSym, setNewSym] = useState("");
    const [newCond, setNewCond] = useState("Price Above");
    const [newTarget, setNewTarget] = useState("");
    const [newFreq, setNewFreq] = useState("Once");

    const handleRemoveFromWatchlist = async (sym: string, listName: string) => {
        try {
            await removeFromWatchlist(sym, listName);
            toast.success(`Removed ${sym} from ${listName}`);
            // Let the page revalidate or refresh manually
            window.location.reload();
        } catch {
            toast.error("Failed to remove item");
        }
    };

    const handleAddAlert = async () => {
        if (!newSym || !newTarget) return toast.error("Symbol & target price required");
        try {
            const res = await createAlert({
                symbol: newSym.toUpperCase(),
                condition: newCond === "Price Above" ? "ABOVE" : "BELOW",
                targetPrice: Number(newTarget),
                frequency: newFreq === "Once" ? "ONCE" : "RECURRING"
            });
            if (res.ok) {
                toast.success("Alert created");
                window.location.reload();
            } else toast.error("Failed");
        } catch {
            toast.error("Failed to set alert");
        }
    };

    const handleRemoveAlert = async (id: string) => {
        try {
            await removeAlert(id);
            setAlerts(prev => prev.filter(a => a.id !== id));
            toast.success("Alert removed");
        } catch {
            toast.error("Failed to remove alert");
        }
    };

    const visibleAlerts = alerts.filter(a => {
        if (alertTab === "Active") return a.status === "active";
        if (alertTab === "Triggered") return a.status === "triggered";
        return true;
    });

    return (
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 24px 60px", color: "var(--nt-txt)", fontFamily: "var(--font-syne)" }}>
            <style>{`
                @keyframes pulse { 0% { opacity: 0.5; transform: scale(0.9); } 50% { opacity: 1; transform: scale(1.3); } 100% { opacity: 0.5; transform: scale(0.9); } }
                ::-webkit-scrollbar { width: 6px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
            `}</style>
            
            {/* Watchlist Section */}
            <div style={{ ...S.card, marginBottom: 20 }}>
                <div style={{ ...S.cardHead, padding: "12px 18px" }}>
                    <div style={S.tabGroup}>
                        {tabKeys.map(k => (
                            <button key={k} onClick={() => setTab(k)} style={{ padding: "6px 14px", borderRadius: 6, fontSize: 13, fontWeight: 600, background: tab === k ? "var(--nt-gold)" : "transparent", color: tab === k ? "#080810" : "var(--nt-txt2)", border: "none", cursor: "pointer", transition: "all 0.2s" }}>
                                {k}
                            </button>
                        ))}
                    </div>
                    <LivePill />
                </div>
                
                {/* Headers */}
                <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr 2fr 80px", gap: 16, padding: "10px 18px", borderBottom: "1px solid var(--nt-border)", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--nt-txt3)" }}>
                    <div>Symbol</div>
                    <div style={{ textAlign: "right" }}>Price</div>
                    <div style={{ textAlign: "right" }}>Change</div>
                    <div>Trend</div>
                    <div>Note</div>
                    <div style={{ textAlign: "center" }}>Actions</div>
                </div>

                {activeList.length === 0 ? (
                    <div style={{ padding: 40, textAlign: "center", color: "var(--nt-txt3)" }}>No stocks in this watchlist. Search to add some!</div>
                ) : activeList.map((st, i) => {
                    const basePrice = quotes[st.symbol] || 0;
                    // Mocking daily change for now since quotes only gives us current price
                    const change = (Math.random() * 4 - 2); 
                    const isUp = change >= 0;
                    
                    return (
                        <div key={st.symbol} style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr 2fr 80px", gap: 16, padding: "14px 18px", alignItems: "center", borderBottom: i < activeList.length - 1 ? "1px solid var(--nt-border)" : "none", background: "transparent", transition: "background 0.15s" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 700 }}>{st.symbol}</div>
                                <div style={{ fontSize: 11, color: "var(--nt-txt3)" }}>{st.company}</div>
                            </div>
                            <div style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 700, color: "var(--nt-txt)" }}>
                                {loading ? <Loader2 className="w-4 h-4 animate-spin inline-block" /> : basePrice ? `$${basePrice.toFixed(2)}` : '--'}
                            </div>
                            <div style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 600, color: isUp ? "var(--nt-green)" : "var(--nt-red)" }}>
                                {isUp ? "+" : ""}{change.toFixed(2)}%
                            </div>
                            <div><Sparkline up={isUp} seed={st.symbol.length} /></div>
                            <div style={{ fontSize: 12, color: "var(--nt-txt2)" }}>Added to {st.listName}</div>
                            <div style={{ display: "flex", justifyContent: "center" }}>
                                <button onClick={() => handleRemoveFromWatchlist(st.symbol, st.listName)} style={{ background: "none", border: "none", color: "var(--nt-txt3)", cursor: "pointer", padding: 4 }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Bottom Grid: Alerts & News */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: 20 }}>
                {/* ALERTS MODULE */}
                <div style={S.card}>
                    <div style={S.cardHead}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 700 }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--nt-gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
                            Price Alerts
                        </div>
                        <div style={S.tabGroup}>
                            {["All", "Active", "Triggered"].map(t => (
                                <button key={t} onClick={() => setAlertTab(t as any)} style={{ padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: alertTab === t ? "var(--nt-surface3)" : "transparent", color: alertTab === t ? "var(--nt-txt)" : "var(--nt-txt3)", border: "none", cursor: "pointer" }}>
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div style={{ padding: 18, background: "rgba(255,255,255,0.015)", borderBottom: "1px solid var(--nt-border)", display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end" }}>
                        <input type="text" value={newSym} onChange={e => setNewSym(e.target.value)} placeholder="SYM" style={{ width: 60, padding: "8px 10px", background: "var(--nt-surface2)", border: "1px solid var(--nt-border)", borderRadius: 8, color: "#fff", fontSize: 13 }} />
                        <select value={newCond} onChange={e => setNewCond(e.target.value)} style={{ padding: "8px 10px", background: "var(--nt-surface2)", border: "1px solid var(--nt-border)", borderRadius: 8, color: "#fff", fontSize: 13 }}>
                            <option>Price Above</option>
                            <option>Price Below</option>
                        </select>
                        <input type="number" value={newTarget} onChange={e => setNewTarget(e.target.value)} placeholder="0.00" style={{ width: 80, padding: "8px 10px", background: "var(--nt-surface2)", border: "1px solid var(--nt-border)", borderRadius: 8, color: "#fff", fontSize: 13 }} />
                        <button onClick={handleAddAlert} style={S.btn(true)}>Add Alert</button>
                    </div>

                    <div style={{ padding: "10px 18px" }}>
                        {visibleAlerts.length === 0 ? <div style={{ padding: 20, textAlign: "center", color: "var(--nt-txt3)" }}>No alerts found.</div> : visibleAlerts.map(a => (
                            <div key={a.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--nt-border)" }}>
                                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                                    <div style={{ fontWeight: "bold", width: 50 }}>{a.symbol}</div>
                                    <div style={{ color: "var(--nt-txt2)", fontSize: 13 }}>{a.condition} <span style={{ color: "var(--nt-gold)", fontWeight: "bold" }}>${a.targetPrice}</span></div>
                                </div>
                                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                                    <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, background: a.status === "active" ? "var(--nt-green-dim)" : "var(--nt-red-dim)", color: a.status === "active" ? "var(--nt-green)" : "var(--nt-red)" }}>{a.status}</span>
                                    <button onClick={() => handleRemoveAlert(a.id)} style={{ background: "none", border: "none", color: "var(--nt-txt3)", cursor: "pointer" }}>x</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* NEWS MODULE */}
                <div style={S.card}>
                    <div style={S.cardHead}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 700 }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--nt-green)", display: "inline-block" }} />
                            Related News
                        </div>
                        <LivePill />
                    </div>
                    {NEWS_DATA.map((n, i) => (
                        <div key={i} style={{ display: "flex", gap: 12, padding: "12px 18px", borderBottom: "1px solid var(--nt-border)" }}>
                            <div style={{ width: 3, borderRadius: 3, background: n.col, minHeight: 40 }} />
                            <div>
                                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{n.title}</div>
                                <div style={{ display: "flex", gap: 10, fontSize: 11, color: "var(--nt-txt3)" }}>
                                    <span>{n.tag}</span>
                                    <span>{n.age}</span>
                                    <SentimentBadge headline={n.title} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}