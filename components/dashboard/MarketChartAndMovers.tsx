'use client';
import { useState, useMemo } from "react";
import { AdvancedChart } from "@/components/charts/AdvancedChart";
import { CompanySummary } from "@/components/ai/CompanySummary";

// ─── Config ─────────────────────────────────────────────────────────────────
const RANGES = ["1D", "1W", "1M", "3M", "1Y", "5Y"];
const SECTOR_TABS = ["Financial", "Technology", "Services", "Healthcare", "Energy"];

// ─── Indices ────────────────────────────────────────────────────────────────
const INDICES = [
    { label: "S&P 500", val: "5,308.15", chg: "+0.87%", pts: "+45.76", up: true },
    { label: "NASDAQ", val: "16,742.39", chg: "+1.24%", pts: "+204.88", up: true },
    { label: "DOW", val: "38,868.04", chg: "+0.32%", pts: "+123.73", up: true },
    { label: "VIX", val: "14.23", chg: "-3.12%", pts: "-0.46", up: false },
    { label: "BTC/USD", val: "67,321", chg: "+2.08%", pts: "+1,373", up: true },
    { label: "GOLD", val: "2,356.40", chg: "-0.19%", pts: "-4.50", up: false },
];

// ─── Key Stats ──────────────────────────────────────────────────────────────
const KEY_STATS = [
    { label: "52W High", val: "$589.46" },
    { label: "52W Low", val: "$212.40" },
    { label: "Mkt Cap", val: "$3.28T" },
    { label: "P/E Ratio", val: "33.4x" },
    { label: "Vol (10D)", val: "52.1M" },
    { label: "Avg Vol", val: "48.3M" },
    { label: "Beta", val: "1.24" },
    { label: "Dividend", val: "0.92%" },
];

// ─── Movers ─────────────────────────────────────────────────────────────────
const MOVERS_ACTIVE = [
    { sym: "NVDA", name: "Nvidia Corporation", price: "$875.40", chg: "+2.31%", pct: 2.31, vol: "71.2M", up: true },
    { sym: "AAPL", name: "Apple Inc.", price: "$213.07", chg: "+0.94%", pct: 0.94, vol: "58.4M", up: true },
    { sym: "MSFT", name: "Microsoft Corporation", price: "$419.72", chg: "+1.03%", pct: 1.03, vol: "22.1M", up: true },
    { sym: "TSLA", name: "Tesla Inc.", price: "$248.50", chg: "-1.22%", pct: -1.22, vol: "93.6M", up: false },
    { sym: "INTC", name: "Intel Corporation", price: "$44.11", chg: "-1.14%", pct: -1.14, vol: "34.7M", up: false },
    { sym: "AMD", name: "Advanced Micro Devices", price: "$164.22", chg: "+4.01%", pct: 4.01, vol: "66.5M", up: true },
    { sym: "GOOG", name: "Alphabet Inc.", price: "$177.23", chg: "+0.78%", pct: 0.78, vol: "19.3M", up: true },
];

const MOVERS_GAINERS = MOVERS_ACTIVE.filter(m => m.up).sort((a, b) => b.pct - a.pct);
const MOVERS_LOSERS = MOVERS_ACTIVE.filter(m => !m.up).sort((a, b) => a.pct - b.pct);

// ─── Chart Data Gen ──────────────────────────────────────────────────────────
const generateDummyData = () => {
    let lastPrice = 300;
    const data = [];
    const now = new Date();
    for (let i = 90; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const open = lastPrice;
        const close = open + (Math.random() - 0.46) * 10;
        const high = Math.max(open, close) + Math.random() * 5;
        const low = Math.min(open, close) - Math.random() * 5;
        data.push({ time, open, high, low, close });
        lastPrice = close;
    }
    return data;
};

// ─── Micro Sparkline ─────────────────────────────────────────────────────────
function MicroBar({ up, h = 24 }: { up: boolean; h?: number }) {
    const bars = [0.45, 0.62, 0.5, 0.85, 0.6, 0.78, up ? 1 : 0.25];
    const col = up ? "#00E5A0" : "#FF4D6D";
    return (
        <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: h }}>
            {bars.map((b, i) => (
                <div key={i} style={{
                    width: 3, height: `${b * 100}%`, borderRadius: 2,
                    background: col, opacity: i === bars.length - 1 ? 1 : 0.3 + b * 0.4,
                    transition: "height 0.3s ease",
                }} />
            ))}
        </div>
    );
}

// ─── Volume Bar ───────────────────────────────────────────────────────────────
function VolumeBar({ pct, up }: { pct: number; up: boolean }) {
    const col = up ? "#00E5A0" : "#FF4D6D";
    return (
        <div style={{ width: 40, height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${Math.min(Math.abs(pct) * 8, 100)}%`, background: col, borderRadius: 2 }} />
        </div>
    );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function MarketChartAndMovers() {
    const [range, setRange] = useState("1Y");
    const [tab, setTab] = useState(0);
    const [moverTab, setMoverTab] = useState(0);
    const [selectedMover, setSelectedMover] = useState(MOVERS_ACTIVE[0]);

    const dummyData = useMemo(() => generateDummyData(), []);

    const currentMovers = moverTab === 0 ? MOVERS_ACTIVE : moverTab === 1 ? MOVERS_GAINERS : MOVERS_LOSERS;

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

            {/* ── Indices Strip ────────────────────────────────────────────── */}
            <div style={{
                display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8,
            }}>
                {INDICES.map(idx => (
                    <div key={idx.label} style={{
                        background: "#0F0F12", border: "1px solid rgba(255,255,255,0.07)",
                        borderRadius: 10, padding: "9px 12px", cursor: "default",
                        transition: "border-color 0.18s",
                        position: "relative", overflow: "hidden",
                    }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)")}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}
                    >
                        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1.5, background: idx.up ? "rgba(0,229,160,0.4)" : "rgba(255,77,109,0.4)" }} />
                        <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#5A5865", marginBottom: 4 }}>{idx.label}</div>
                        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 700, color: "#EAEAEA", marginBottom: 2 }}>{idx.val}</div>
                        <div style={{ fontFamily: "monospace", fontSize: 10, color: idx.up ? "#00E5A0" : "#FF4D6D", fontWeight: 600 }}>
                            {idx.chg} <span style={{ color: "#5A5865", fontWeight: 400 }}>({idx.pts})</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Main Row ──────────────────────────────────────────────────── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 12 }}>

                {/* Chart Panel */}
                <div id="main-chart-panel" style={{ background: "#0F0F12", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                    {/* Header */}
                    <div style={{ padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#5A5865" }}>
                                Market Overview — {SECTOR_TABS[tab]}
                            </span>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 100, background: "rgba(0,229,160,0.1)", color: "#00E5A0", fontSize: 9, fontWeight: 700 }}>
                                <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#00E5A0", animation: "pulse 1.5s ease-in-out infinite", display: "inline-block" }} />
                                LIVE
                            </span>
                        </div>
                        <div style={{ display: "flex", gap: 2 }}>
                            {RANGES.map(r => (
                                <button key={r} onClick={() => setRange(r)} style={{
                                    padding: "2px 9px", borderRadius: 5, fontSize: 10, fontWeight: 600, border: "none", cursor: "pointer",
                                    background: range === r ? "rgba(232,197,71,0.12)" : "transparent",
                                    color: range === r ? "#E8C547" : "#5A5865",
                                    transition: "all 0.15s",
                                }}>{r}</button>
                            ))}
                        </div>
                    </div>

                    {/* Price + sector tabs row */}
                    <div style={{ padding: "12px 16px 0", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                        <div>
                            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 30, fontWeight: 700, color: "#EAEAEA", lineHeight: 1 }}>310.79</div>
                                <div style={{ fontFamily: "monospace", fontSize: 11, color: "#00E5A0", fontWeight: 700 }}>▲ +0.89%</div>
                            </div>
                            <div style={{ display: "flex", gap: 12, marginTop: 5, fontSize: 10, color: "#5A5865" }}>
                                <span>O <b style={{ color: "#EAEAEA" }}>307.83</b></span>
                                <span>H <b style={{ color: "#00E5A0" }}>313.21</b></span>
                                <span>L <b style={{ color: "#FF4D6D" }}>306.44</b></span>
                                <span>Vol <b style={{ color: "#EAEAEA" }}>52.1M</b></span>
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: 3, flexWrap: "wrap", justifyContent: "flex-end" }}>
                            {SECTOR_TABS.map((t, i) => (
                                <button key={t} onClick={() => setTab(i)} style={{
                                    padding: "4px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600, border: "none", cursor: "pointer",
                                    background: tab === i ? "#E8C547" : "rgba(255,255,255,0.05)",
                                    color: tab === i ? "#0A0A0C" : "#5A5865",
                                    transition: "all 0.15s",
                                }}>{t}</button>
                            ))}
                        </div>
                    </div>

                    {/* Chart */}
                    <div style={{ height: 270, position: "relative" }}>
                        <AdvancedChart data={dummyData} type="candlestick" />
                    </div>

                    {/* Key Stats row */}
                    <div style={{ padding: "8px 16px 12px", borderTop: "1px solid rgba(255,255,255,0.05)", display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 4 }}>
                        {KEY_STATS.map(s => (
                            <div key={s.label} style={{ textAlign: "center" }}>
                                <div style={{ fontSize: 8.5, color: "#5A5865", fontWeight: 600, marginBottom: 3 }}>{s.label}</div>
                                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, fontWeight: 700, color: "#EAEAEA" }}>{s.val}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Movers Panel */}
                <div style={{ background: "#0F0F12", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                    {/* Header */}
                    <div style={{ padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#5A5865" }}>Top Movers</span>
                        <div style={{ display: "flex", gap: 2 }}>
                            {["Active", "Gainers", "Losers"].map((t, i) => (
                                <button key={t} onClick={() => setMoverTab(i)} style={{
                                    padding: "2px 8px", borderRadius: 4, fontSize: 9, fontWeight: 600, cursor: "pointer",
                                    border: "1px solid " + (moverTab === i ? "rgba(255,255,255,0.14)" : "transparent"),
                                    background: moverTab === i ? "#1A1A1E" : "transparent",
                                    color: moverTab === i ? "#EAEAEA" : "#5A5865",
                                    transition: "all 0.15s",
                                }}>{t}</button>
                            ))}
                        </div>
                    </div>

                    {/* Movers list */}
                    <div style={{ flex: 1, overflowY: "auto" }}>
                        {currentMovers.map((m, i) => (
                            <div key={m.sym} onClick={() => setSelectedMover(m)} style={{
                                display: "flex", alignItems: "center", gap: 8,
                                padding: "8px 14px",
                                borderBottom: i < currentMovers.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                                borderLeft: selectedMover.sym === m.sym ? `2px solid ${m.up ? "#00E5A0" : "#FF4D6D"}` : "2px solid transparent",
                                cursor: "pointer", transition: "all 0.12s",
                                background: selectedMover.sym === m.sym ? "rgba(255,255,255,0.03)" : "transparent",
                            }}
                                onMouseEnter={e => { if (selectedMover.sym !== m.sym) e.currentTarget.style.background = "#131316"; }}
                                onMouseLeave={e => { if (selectedMover.sym !== m.sym) e.currentTarget.style.background = "transparent"; }}
                            >
                                {/* Icon */}
                                <div style={{
                                    width: 28, height: 28, borderRadius: 7, flexShrink: 0,
                                    background: m.up ? "rgba(0,229,160,0.08)" : "rgba(255,77,109,0.08)",
                                    color: m.up ? "#00E5A0" : "#FF4D6D",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: 8, fontWeight: 800, letterSpacing: "-0.02em",
                                    border: `1px solid ${m.up ? "rgba(0,229,160,0.15)" : "rgba(255,77,109,0.15)"}`,
                                }}>{m.sym}</div>

                                {/* Name */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: 11.5, fontWeight: 700, color: "#EAEAEA" }}>{m.sym}</div>
                                    <div style={{ fontSize: 8.5, color: "#5A5865", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.name}</div>
                                </div>

                                {/* Sparkline */}
                                <MicroBar up={m.up} h={22} />

                                {/* Price + change */}
                                <div style={{ textAlign: "right", minWidth: 60 }}>
                                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 700, color: "#EAEAEA" }}>{m.price}</div>
                                    <div style={{ fontFamily: "monospace", fontSize: 10, fontWeight: 700, color: m.up ? "#00E5A0" : "#FF4D6D" }}>{m.chg}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Volume heatmap mini section */}
                    <div style={{ padding: "10px 14px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                        <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#5A5865", marginBottom: 8 }}>Volume Pressure</div>
                        {currentMovers.slice(0, 5).map(m => (
                            <div key={m.sym} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                                <span style={{ fontFamily: "monospace", fontSize: 9, fontWeight: 700, width: 32, color: "#5A5865" }}>{m.sym}</span>
                                <VolumeBar pct={m.pct} up={m.up} />
                                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#5A5865", marginLeft: "auto" }}>{m.vol}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── AI Company Summary ──────────────────────────────────────── */}
            <div style={{ background: "#0F0F12", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, overflow: "hidden" }}>
                <div style={{ padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#5A5865" }}>AI Company Analysis</span>
                    <span style={{ padding: "2px 8px", borderRadius: 100, background: "rgba(155,110,255,0.12)", color: "#9B6EFF", fontSize: 9, fontWeight: 700 }}>◈ {selectedMover.sym}</span>
                </div>
                <div style={{ padding: "12px 16px" }}>
                    <CompanySummary symbol={selectedMover.sym} companyName={selectedMover.name} />
                </div>
            </div>
        </div>
    );
}
