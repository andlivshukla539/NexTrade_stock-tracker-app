'use client';
import { useState } from "react";

const GAINERS = [
    { sym: "CDIO", name: "Cardio Diagnostics", price: "2.88", chg: "+28.57%", up: true },
    { sym: "OPEN", name: "Opendoor Tech", price: "5.00", chg: "+7.53%", up: true },
    { sym: "NVDA", name: "Nvidia Corp", price: "189.82", chg: "+1.02%", up: true },
    { sym: "GOOG", name: "Alphabet Inc", price: "177.23", chg: "+4.01%", up: true },
];

const LOSERS = [
    { sym: "ORCL", name: "Oracle Corp", price: "122.40", chg: "−5.40%", up: false },
    { sym: "TSLA", name: "Tesla Inc", price: "248.50", chg: "−1.22%", up: false },
    { sym: "INTC", name: "Intel Corp", price: "38.90", chg: "−1.14%", up: false },
    { sym: "WMT", name: "Walmart Inc", price: "68.25", chg: "−1.51%", up: false },
];

function MiniSpark({ up }: { up: boolean }) {
    const pts: string[] = [];
    let y = up ? 24 : 8;
    for (let i = 0; i < 8; i++) {
        y += (Math.random() - 0.3) * (up ? -3.5 : 3.5);
        y = Math.max(4, Math.min(28, y));
        pts.push(`${i * 60 / 7},${y}`);
    }
    return (
        <svg viewBox="0 0 60 32" width="100%" height="32">
            <polyline points={pts.join(" ")} fill="none" stroke={up ? "#2ECC8A" : "#F0524F"} strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
    );
}

export default function TopMoversPanel() {
    const [tab, setTab] = useState(0);
    const movers = tab === 0 ? GAINERS : LOSERS;

    return (
        <div style={{ background: "#0D0D10", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, color: "#F0EEE8" }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#2ECC8A", display: "inline-block" }} />
                    Top Movers
                </div>
                <div style={{ display: "flex", background: "#131316", borderRadius: 8, padding: 3, gap: 2 }}>
                    {["Gainers", "Losers"].map((t, i) => (
                        <button key={t} onClick={() => setTab(i)} style={{
                            padding: "4px 12px", borderRadius: 6, fontSize: 11, fontWeight: 600, border: "none", cursor: "pointer",
                            background: tab === i ? "#1A1A1E" : "none",
                            color: tab === i ? "#F0EEE8" : "#5A5865",
                            transition: "all 0.15s",
                        }}>{t}</button>
                    ))}
                </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: 12 }}>
                {movers.map(m => (
                    <div key={m.sym} style={{
                        background: "#131316", border: "1px solid rgba(255,255,255,0.06)",
                        borderRadius: 12, padding: 12, cursor: "pointer",
                        transition: "border-color 0.15s, transform 0.15s",
                    }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.14)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.transform = ""; }}
                    >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 600, color: "#F0EEE8" }}>{m.sym}</span>
                            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 600, color: m.up ? "#2ECC8A" : "#F0524F" }}>{m.chg}</span>
                        </div>
                        <div style={{ fontSize: 10, color: "#5A5865", marginBottom: 6 }}>{m.name}</div>
                        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 16, fontWeight: 500, color: "#F0EEE8", marginBottom: 4 }}>${m.price}</div>
                        <MiniSpark up={m.up} />
                    </div>
                ))}
            </div>
        </div>
    );
}
