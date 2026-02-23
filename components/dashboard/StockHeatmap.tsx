'use client';

const HM = [

    { sym: "NVDA", chg: "+2.3%", cls: "vup", w: 2, h: 2 },
    { sym: "AAPL", chg: "+1.54%", cls: "up", w: 2, h: 1 },
    { sym: "GOOG", chg: "+4.0%", cls: "vup", w: 2, h: 1 },
    { sym: "META", chg: "+1.69%", cls: "up", w: 1, h: 1 },
    { sym: "AMZN", chg: "+2.56%", cls: "up", w: 1, h: 1 },
    { sym: "MSFT", chg: "-0.31%", cls: "dn", w: 1, h: 1 },
    { sym: "TSLA", chg: "-1.22%", cls: "dn", w: 1, h: 1 },
    { sym: "AMD", chg: "-0.58%", cls: "dn", w: 1, h: 1 },
    { sym: "JPM", chg: "+0.89%", cls: "up", w: 1, h: 1 },
    { sym: "WFC", chg: "+1.29%", cls: "up", w: 1, h: 1 },
    { sym: "BAC", chg: "+0.55%", cls: "up", w: 1, h: 1 },
    { sym: "ORCL", chg: "-5.40%", cls: "vdn", w: 1, h: 1 },
];

const BG: Record<string, string> = {
    vup: "linear-gradient(135deg,#1a4a32,#1d5c3a)",
    up: "linear-gradient(135deg,#112b1e,#163625)",
    neu: "#1A1A1E",
    dn: "linear-gradient(135deg,#2d1111,#391515)",
    vdn: "linear-gradient(135deg,#3d1010,#4d1414)",
};

export default function StockHeatmap() {
    return (
        <div style={{ background: "#0F0F12", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 3, height: 14, borderRadius: 2, background: "#E8C547", display: "inline-block" }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#EAEAEA" }}>Stock Heatmap</span>
                </div>
                <span style={{ fontSize: 10, color: "#5A5865", cursor: "pointer" }}>Full view →</span>
            </div>
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(6, 1fr)",
                gridAutoRows: "56px",
                gap: 3, padding: 10,
            }}>
                {HM.map((h, i) => (
                    <div key={i} style={{
                        gridColumn: h.w > 1 ? `span ${h.w}` : undefined,
                        gridRow: h.h > 1 ? `span ${h.h}` : undefined,
                        borderRadius: 7,
                        background: BG[h.cls] || "#1A1A1E",
                        display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center",
                        cursor: "pointer", transition: "filter 0.15s",
                    }}
                        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.filter = "brightness(1.2)")}
                        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.filter = "")}
                    >
                        <div style={{ fontFamily: "monospace", fontSize: h.w > 1 ? 12 : 10, fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>{h.sym}</div>
                        <div style={{ fontFamily: "monospace", fontSize: h.w > 1 ? 11 : 9, color: "rgba(255,255,255,0.65)", marginTop: 2 }}>{h.chg}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
