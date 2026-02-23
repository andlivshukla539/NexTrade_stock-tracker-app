'use client';
import { useState } from "react";

const STOCKS = [
    { sym: "JPM", name: "JPMorgan Chase", price: "310.79", chg: "+2.74", pct: "+0.89%", vol: "12.4M", up: true, color: "#2563EB" },
    { sym: "WF", name: "Wells Fargo Co New", price: "88.70", chg: "+1.13", pct: "+1.29%", vol: "8.1M", up: true, color: "#DC2626" },
    { sym: "BAC", name: "Bank Amer Corp", price: "53.06", chg: "+0.29", pct: "+0.55%", vol: "34.2M", up: true, color: "#DC2626" },
    { sym: "HSBC", name: "HSBC Holdings Plc", price: "88.15", chg: "+1.31", pct: "+1.51%", vol: "4.7M", up: true, color: "#DC2626" },
    { sym: "C", name: "Citigroup Inc", price: "116.00", chg: "+0.45", pct: "+0.39%", vol: "9.8M", up: true, color: "#2563EB" },
    { sym: "MA", name: "Mastercard Inc", price: "526.41", chg: "+6.15", pct: "+1.18%", vol: "2.1M", up: true, color: "#F97316" },
];

const TABS = ["Financial", "Technology", "Services"];
const RANGES = ["1D", "1W", "1M", "3M", "1Y", "5Y"];

function Sparkline({ up }: { up: boolean }) {
    const pts: string[] = [];
    let y = up ? 19 : 9;
    for (let i = 0; i < 8; i++) {
        y += (Math.random() - 0.4) * (up ? -4 : 4);
        y = Math.max(3, Math.min(25, y));
        pts.push(`${i * 60 / 7},${y}`);
    }
    return (
        <svg viewBox="0 0 60 28" width="60" height="28">
            <polyline points={pts.join(" ")} fill="none"
                stroke={up ? "#2ECC8A" : "#F0524F"} strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
    );
}

export default function MarketOverviewPanel() {
    const [tab, setTab] = useState(0);
    const [range, setRange] = useState("1Y");

    return (
        <div style={{ background: "#0D0D10", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, overflow: "hidden" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", flexWrap: "wrap", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, color: "#F0EEE8" }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#E8C547", boxShadow: "0 0 6px rgba(232,197,71,0.6)", display: "inline-block" }} />
                    Market Overview
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 100, background: "rgba(46,204,138,0.15)", color: "#2ECC8A", fontSize: 10, fontWeight: 600 }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#2ECC8A", display: "inline-block", animation: "pulse 1.5s ease-in-out infinite" }} />
                        LIVE
                    </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    {/* Tab group */}
                    <div style={{ display: "flex", background: "#131316", borderRadius: 8, padding: 3, gap: 2 }}>
                        {TABS.map((t, i) => (
                            <button key={t} onClick={() => setTab(i)} style={{
                                padding: "4px 12px", borderRadius: 6, fontSize: 11, fontWeight: 600, border: "none", cursor: "pointer",
                                background: tab === i ? "#1A1A1E" : "none",
                                color: tab === i ? "#F0EEE8" : "#5A5865",
                                transition: "all 0.15s",
                            }}>{t}</button>
                        ))}
                    </div>
                    {/* Time range */}
                    <div style={{ display: "flex", gap: 2 }}>
                        {RANGES.map(r => (
                            <button key={r} onClick={() => setRange(r)} style={{
                                padding: "3px 9px", borderRadius: 6, fontSize: 10, fontWeight: 600, border: "none", cursor: "pointer",
                                background: range === r ? "#E8C547" : "none",
                                color: range === r ? "#0A0A0C" : "#5A5865",
                                transition: "all 0.15s",
                            }}>{r}</button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div style={{ position: "relative", overflow: "hidden", height: 220 }}>
                <svg viewBox="0 0 800 220" preserveAspectRatio="none" width="100%" height="100%">
                    <defs>
                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#2ECC8A" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#2ECC8A" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <line x1="0" y1="55" x2="800" y2="55" stroke="rgba(255,255,255,.04)" strokeWidth="1" />
                    <line x1="0" y1="110" x2="800" y2="110" stroke="rgba(255,255,255,.04)" strokeWidth="1" />
                    <line x1="0" y1="165" x2="800" y2="165" stroke="rgba(255,255,255,.04)" strokeWidth="1" />
                    <path d="M0 190 C40 185 80 175 120 165 C160 155 200 148 240 140 C280 132 300 150 340 138 C380 126 400 145 440 120 C480 95 500 85 540 78 C580 70 620 88 660 65 C700 42 740 50 800 38 L800 220 L0 220 Z" fill="url(#areaGrad)" />
                    <path d="M0 190 C40 185 80 175 120 165 C160 155 200 148 240 140 C280 132 300 150 340 138 C380 126 400 145 440 120 C480 95 500 85 540 78 C580 70 620 88 660 65 C700 42 740 50 800 38" fill="none" stroke="#2ECC8A" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="800" cy="38" r="4" fill="#2ECC8A">
                        <animate attributeName="r" values="4;8;4" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <text x="10" y="215" fill="#5A5865" fontFamily="JetBrains Mono" fontSize="9">Mar</text>
                    <text x="160" y="215" fill="#5A5865" fontFamily="JetBrains Mono" fontSize="9">May</text>
                    <text x="310" y="215" fill="#5A5865" fontFamily="JetBrains Mono" fontSize="9">Jul</text>
                    <text x="460" y="215" fill="#5A5865" fontFamily="JetBrains Mono" fontSize="9">Sep</text>
                    <text x="610" y="215" fill="#5A5865" fontFamily="JetBrains Mono" fontSize="9">Nov</text>
                    <text x="750" y="215" fill="#5A5865" fontFamily="JetBrains Mono" fontSize="9">2026</text>
                </svg>
                {/* Y labels */}
                <div style={{ position: "absolute", right: 12, top: 0, bottom: 0, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "8px 0", fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#5A5865" }}>
                    <span>$320</span><span>$310</span><span>$295</span><span>$280</span>
                </div>
            </div>

            {/* Stock table */}
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        {["Name", "Price", "Change", "Chg%", "Volume", "7D"].map((h, i) => (
                            <th key={h} style={{ padding: "10px 14px", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#5A5865", borderBottom: "1px solid rgba(255,255,255,0.06)", textAlign: i === 0 ? "left" : "right" }}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {STOCKS.map(s => (
                        <tr key={s.sym} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", cursor: "pointer" }}
                            onMouseEnter={e => (e.currentTarget.style.background = "#131316")}
                            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                            <td style={{ padding: "11px 14px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <div style={{ width: 30, height: 30, borderRadius: 8, background: s.color + "22", color: s.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                                        {s.sym.substring(0, 2)}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 500, color: "#F0EEE8", fontSize: 13 }}>{s.sym}</div>
                                        <div style={{ fontSize: 11, color: "#5A5865" }}>{s.name}</div>
                                    </div>
                                </div>
                            </td>
                            <td style={{ textAlign: "right", padding: "11px 14px", fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#F0EEE8" }}>{s.price}</td>
                            <td style={{ textAlign: "right", padding: "11px 14px", fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: s.up ? "#2ECC8A" : "#F0524F" }}>{s.chg}</td>
                            <td style={{ textAlign: "right", padding: "11px 14px", fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: s.up ? "#2ECC8A" : "#F0524F" }}>{s.pct}</td>
                            <td style={{ textAlign: "right", padding: "11px 14px", fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#5A5865" }}>{s.vol}</td>
                            <td style={{ textAlign: "right", padding: "11px 14px" }}><Sparkline up={s.up} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
