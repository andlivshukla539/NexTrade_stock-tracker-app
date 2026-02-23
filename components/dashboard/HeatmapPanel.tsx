const HM = [
    { sym: "NVDA", chg: "+1.02%", cls: "vup", big: true },
    { sym: "AAPL", chg: "+1.54%", cls: "up", big: true },
    { sym: "GOOGL", chg: "+4.01%", cls: "vup", big: true },
    { sym: "META", chg: "+1.69%", cls: "up", big: false },
    { sym: "MSFT", chg: "−0.31%", cls: "dn", big: false },
    { sym: "AMZN", chg: "+2.56%", cls: "up", big: false },
    { sym: "TSLA", chg: "−5.40%", cls: "vdn", big: false },
    { sym: "AVGO", chg: "−0.40%", cls: "dn", big: false },
    { sym: "NFLX", chg: "+2.17%", cls: "up", big: false },
    { sym: "AMD", chg: "−0.58%", cls: "dn", big: false },
    { sym: "ORCL", chg: "−5.40%", cls: "vdn", big: false },
    { sym: "INTC", chg: "−1.14%", cls: "dn", big: false },
    { sym: "WMT", chg: "−1.51%", cls: "dn", big: false },
    { sym: "BRK", chg: "+0.25%", cls: "up", big: false },
    { sym: "PYPL", chg: "+0.63%", cls: "up", big: false },
    { sym: "V", chg: "+0.63%", cls: "up", big: false },
];

const BG: Record<string, string> = {
    vup: "linear-gradient(135deg,#1a4a32,#1f6040)",
    up: "linear-gradient(135deg,#132d1e,#1a3d28)",
    neu: "#1A1A1E",
    dn: "linear-gradient(135deg,#3d1515,#4a1a1a)",
    vdn: "linear-gradient(135deg,#4a1212,#5a1616)",
};

export default function HeatmapPanel() {
    return (
        <div style={{ background: "#0D0D10", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, color: "#F0EEE8" }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#F0524F", display: "inline-block" }} />
                    Stock Heatmap
                </div>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", fontSize: 11, fontWeight: 600, background: "#131316", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, color: "#9896A0", cursor: "pointer" }}>
                    S&amp;P 500
                </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 4, padding: 14 }}>
                {HM.map((h, i) => (
                    <div key={i} style={{
                        aspectRatio: h.big ? "auto" : "1",
                        gridColumn: h.big ? "span 2" : undefined,
                        gridRow: h.big ? "span 2" : undefined,
                        borderRadius: 8,
                        display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center",
                        padding: 4,
                        cursor: "pointer",
                        background: BG[h.cls] || "#1A1A1E",
                        transition: "transform 0.15s, filter 0.15s",
                    }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1.04)"; (e.currentTarget as HTMLElement).style.filter = "brightness(1.15)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.filter = ""; }}
                    >
                        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: h.big ? 13 : 10, fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>{h.sym}</div>
                        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: h.big ? 11 : 9, color: "rgba(255,255,255,0.7)", marginTop: 1 }}>{h.chg}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
