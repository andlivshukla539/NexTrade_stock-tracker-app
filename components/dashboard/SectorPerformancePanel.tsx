'use client';

const SECTORS = [

    { name: "Technology", val: "+0.48%", pct: 72, up: true },
    { name: "Financials", val: "+0.65%", pct: 68, up: true },
    { name: "Healthcare", val: "−0.28%", pct: 35, up: false },
    { name: "Energy", val: "+1.12%", pct: 80, up: true },
    { name: "Consumer", val: "+0.22%", pct: 55, up: true },
    { name: "Utilities", val: "−0.41%", pct: 28, up: false },
];

export default function SectorPerformancePanel() {
    return (
        <div style={{ background: "#0D0D10", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, color: "#F0EEE8" }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4E9EFF", display: "inline-block" }} />
                    Sector Performance
                </div>
            </div>
            <div style={{ padding: "6px 0" }}>
                {SECTORS.map(s => (
                    <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 16px", cursor: "pointer", transition: "background 0.15s" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "#131316")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                        <div style={{ fontSize: 12, color: "#9896A0", width: 90, flexShrink: 0 }}>{s.name}</div>
                        <div style={{ flex: 1, height: 6, background: "#222228", borderRadius: 6, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${s.pct}%`, background: s.up ? "#2ECC8A" : "#F0524F", borderRadius: 6 }} />
                        </div>
                        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, width: 52, textAlign: "right", flexShrink: 0, color: s.up ? "#2ECC8A" : "#F0524F" }}>{s.val}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
