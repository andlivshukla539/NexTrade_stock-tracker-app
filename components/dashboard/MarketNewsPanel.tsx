'use client';

const NEWS = [
    { title: "Fed signals potential rate pause amid cooling inflation data", ticker: "SPY", age: "2m", color: "#F0524F" },
    { title: "NVIDIA beats Q4 estimates, raises full-year guidance on AI demand", ticker: "NVDA", age: "8m", color: "#2ECC8A" },
    { title: "Apple's iPhone 17 supply chain sees record orders in Q1 2026", ticker: "AAPL", age: "15m", color: "#2ECC8A" },
    { title: "JPMorgan lifts S&P 500 year-end target to 6,500 on earnings strength", ticker: "JPM", age: "31m", color: "#4E9EFF" },
    { title: "Oracle drops on weak cloud revenue despite record AI contracts", ticker: "ORCL", age: "45m", color: "#F0524F" },
];

export default function MarketNewsPanel() {
    return (
        <div style={{ background: "#0D0D10", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, color: "#F0EEE8" }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#E8C547", display: "inline-block" }} />
                    Market News
                </div>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 100, background: "rgba(46,204,138,0.15)", color: "#2ECC8A", fontSize: 10, fontWeight: 600 }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#2ECC8A", display: "inline-block" }} />
                    LIVE
                </span>
            </div>
            <div>
                {NEWS.map((n, i) => (
                    <div key={i} style={{
                        display: "flex", gap: 12, padding: "14px 16px",
                        borderBottom: i < NEWS.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                        cursor: "pointer", transition: "background 0.15s",
                    }}
                        onMouseEnter={e => (e.currentTarget.style.background = "#131316")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: n.color, flexShrink: 0, marginTop: 4 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 12, fontWeight: 500, color: "#F0EEE8", lineHeight: 1.45, marginBottom: 4 }}>{n.title}</div>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: "#5A5865" }}>
                                <span style={{ fontFamily: "'JetBrains Mono',monospace", padding: "1px 6px", borderRadius: 4, fontSize: 9, fontWeight: 600, background: n.color + "22", color: n.color }}>
                                    {n.ticker}
                                </span>
                                <span>{n.age} ago</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
