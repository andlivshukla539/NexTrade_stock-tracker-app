'use client';
import { useState } from "react";

const WATCHLIST = [
    { sym: "JPM", name: "Morgan Chase", price: "318.79", chg: "+3.89%", up: true, color: "#2563EB" },
    { sym: "NVDA", name: "Nvidia Corp", price: "875.40", chg: "+2.31%", up: true, color: "#76B900" },
    { sym: "AAPL", name: "Apple Inc", price: "213.87", chg: "+1.54%", up: true, color: "#A8A8B0" },
    { sym: "TSLA", name: "Tesla Inc", price: "248.50", chg: "-1.77%", up: false, color: "#CC2929" },
    { sym: "GOOG", name: "Alphabet Inc", price: "177.23", chg: "+4.81%", up: true, color: "#4285F4" },
    { sym: "MA", name: "Mastercard Inc", price: "526.41", chg: "+1.18%", up: true, color: "#F97316" },
];

const ALERTS = [
    { sym: "NVDA", text: "NVDA crossed $875 target", color: "#2ECC8A", age: "2 min ago" },
    { sym: "TSLA", text: "TSLA dropped below 50-day MA", color: "#F0524F", age: "41 min ago" },
    { sym: "AAPL", text: "AAPL earnings in 2 days", color: "#E8C547", age: "Just now" },
];

const STORIES = [
    { tag: "BEARISH", tagColor: "#F0524F", bg: "rgba(240,82,79,0.08)", title: "Fed signals rates stay higher amid sticky inflation", source: "Reuters · 10 min ago" },
    { tag: "BULLISH", tagColor: "#2ECC8A", bg: "rgba(46,204,138,0.08)", title: "NVDA Q1 earnings crush estimates — data center demand surges", source: "Bloomberg · 1 hr ago" },
    { tag: "NEUTRAL", tagColor: "#E8C547", bg: "rgba(232,197,71,0.08)", title: "Apple explores AI chip partnerships with TSMC for 2026", source: "WSJ · 2 hr ago" },
];

function SentimentBar() {
    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 9, color: "#5A5865", textTransform: "uppercase", letterSpacing: "0.12em" }}>
                <span>Bearish</span><span>Neutral</span><span>Bullish</span>
            </div>
            <div style={{ height: 6, borderRadius: 6, overflow: "hidden", background: "linear-gradient(90deg,#F0524F 0%,#E8C547 50%,#2ECC8A 100%)", position: "relative" }}>
                {/* needle */}
                <div style={{ position: "absolute", left: "30%", top: -2, width: 2, height: 10, background: "#fff", borderRadius: 1, boxShadow: "0 0 4px rgba(255,255,255,0.6)" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                <div>
                    <div style={{ fontSize: 26, fontWeight: 700, color: "#F0524F" }}>Bearish</div>
                    <div style={{ fontSize: 10, color: "#5A5865" }}>Score: 30/100</div>
                </div>
                <div style={{ padding: "3px 8px", borderRadius: 5, background: "#131316", border: "1px solid rgba(255,255,255,0.07)", fontSize: 9, fontWeight: 700, color: "#5A5865", letterSpacing: "0.08em" }}>MARKET</div>
            </div>
        </div>
    );
}

export default function RightSidebar() {
    const [wTab, setWTab] = useState<"allocation" | "watchlist">("allocation");

    return (
        <aside id="right-sidebar-panel" style={{
            width: 240, flexShrink: 0,
            background: "#0B0B0E",
            borderLeft: "1px solid rgba(255,255,255,0.06)",
            overflowY: "auto", display: "flex", flexDirection: "column",
        }}>

            {/* Allocation / Watchlist toggle */}
            <div style={{ padding: "12px 14px 8px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ display: "flex", background: "#131316", borderRadius: 7, padding: 3, gap: 2, marginBottom: 14 }}>
                    {(["allocation", "watchlist"] as const).map(t => (
                        <button key={t} onClick={() => setWTab(t)} style={{
                            flex: 1, padding: "4px 0", borderRadius: 5, fontSize: 10, fontWeight: 600, border: "none", cursor: "pointer",
                            background: wTab === t ? "#1E1E24" : "none",
                            color: wTab === t ? "#EAEAEA" : "#5A5865",
                            textTransform: "capitalize",
                        }}>{t}</button>
                    ))}
                </div>

                {wTab === "allocation" ? (
                    <div>
                        {/* Donut */}
                        <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                            <div style={{ position: "relative", width: 110, height: 110 }}>
                                <svg viewBox="0 0 110 110" width="110" height="110">
                                    {/* Donut segments */}
                                    <circle cx="55" cy="55" r="40" fill="none" strokeWidth="18" stroke="#2563EB"
                                        strokeDasharray="105.6 150.8" strokeDashoffset="0" />
                                    <circle cx="55" cy="55" r="40" fill="none" strokeWidth="18" stroke="#F0524F"
                                        strokeDasharray="60.3 196.1" strokeDashoffset="-105.6" />
                                    <circle cx="55" cy="55" r="40" fill="none" strokeWidth="18" stroke="#2ECC8A"
                                        strokeDasharray="37.7 218.7" strokeDashoffset="-165.9" />
                                    <circle cx="55" cy="55" r="40" fill="none" strokeWidth="18" stroke="#E8C547"
                                        strokeDasharray="53.4 203" strokeDashoffset="-203.6" />
                                    <text x="55" y="51" textAnchor="middle" fill="#EAEAEA" fontSize="13" fontWeight="700" fontFamily="'JetBrains Mono',monospace">$142k</text>
                                    <text x="55" y="63" textAnchor="middle" fill="#5A5865" fontSize="8">Portfolio</text>
                                </svg>
                            </div>
                        </div>
                        {/* Legend */}
                        {[
                            { label: "Technology", color: "#2563EB", pct: "42%", val: "$60k" },
                            { label: "Finance", color: "#F0524F", pct: "28%", val: "$40k" },
                            { label: "Energy", color: "#2ECC8A", pct: "15%", val: "$21k" },
                            { label: "Other", color: "#E8C547", pct: "15%", val: "$21k" },
                        ].map(l => (
                            <div key={l.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    <span style={{ width: 8, height: 8, borderRadius: 2, background: l.color, flexShrink: 0 }} />
                                    <span style={{ fontSize: 11, color: "#9896A0" }}>{l.label}</span>
                                </div>
                                <div style={{ display: "flex", gap: 6 }}>
                                    <span style={{ fontSize: 10, color: "#5A5865", fontFamily: "monospace" }}>{l.val}</span>
                                    <span style={{ fontSize: 10, color: "#5A5865", fontFamily: "monospace" }}>{l.pct}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {WATCHLIST.map(w => (
                            <div key={w.sym} style={{
                                display: "flex", alignItems: "center", gap: 8,
                                padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", cursor: "pointer",
                            }}>
                                <div style={{ width: 26, height: 26, borderRadius: 6, background: w.color + "22", color: w.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, flexShrink: 0 }}>
                                    {w.sym.substring(0, 2)}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: 11, fontWeight: 600, color: "#EAEAEA" }}>{w.sym}</div>
                                    <div style={{ fontSize: 9, color: "#5A5865", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{w.name}</div>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <div style={{ fontSize: 11, fontFamily: "monospace", color: "#EAEAEA" }}>{w.price}</div>
                                    <div style={{ fontSize: 10, fontFamily: "monospace", color: w.up ? "#2ECC8A" : "#F0524F" }}>{w.chg}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Sentiment */}
            <div style={{ padding: "12px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#3D3B45", marginBottom: 10 }}>Sentiment</div>
                <SentimentBar />
            </div>

            {/* Alerts */}
            <div style={{ padding: "12px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#3D3B45", marginBottom: 10 }}>Alerts</div>
                {ALERTS.map((a, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: a.color, flexShrink: 0, marginTop: 4 }} />
                        <div>
                            <div style={{ fontSize: 11, color: "#EAEAEA", lineHeight: 1.4, marginBottom: 2 }}>
                                <span style={{ color: a.color, fontWeight: 600 }}>{a.sym}</span> {a.text.replace(a.sym + " ", "")}
                            </div>
                            <div style={{ fontSize: 9, color: "#3D3B45" }}>{a.age}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Analyzed Stories */}
            <div style={{ padding: "12px 14px" }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#3D3B45", marginBottom: 10 }}>Analyzed Stories</div>
                {STORIES.map((s, i) => (
                    <div key={i} style={{ marginBottom: 10, padding: "8px", borderRadius: 8, background: s.bg, cursor: "pointer" }}>
                        <span style={{ fontSize: 8, fontWeight: 800, color: s.tagColor, letterSpacing: "0.12em", display: "block", marginBottom: 4 }}>{s.tag}</span>
                        <div style={{ fontSize: 11, color: "#EAEAEA", lineHeight: 1.4, marginBottom: 3 }}>{s.title}</div>
                        <div style={{ fontSize: 9, color: "#3D3B45" }}>{s.source}</div>
                    </div>
                ))}
            </div>
        </aside>
    );
}
