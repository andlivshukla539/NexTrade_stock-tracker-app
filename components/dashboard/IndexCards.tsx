'use client';

export default function IndexCards() {
    const cards = [
        {
            label: "S&P 500",
            value: "5,308.14",
            change: "+0.41%",
            pts: "+21.82 pts",
            up: true,
            color: "#2ECC8A",
        },
        {
            label: "NASDAQ",
            value: "16,742",
            change: "+0.94%",
            pts: "+155.7 pts",
            up: true,
            color: "#4E9EFF",
        },
        {
            label: "VIX FEAR INDEX",
            value: "13.47",
            change: "-1.14%",
            pts: "Low Volatility",
            up: false,
            color: "#F0524F",
        },
    ];

    return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
            {cards.map((c) => (
                <div key={c.label} style={{
                    background: "#0F0F12",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 12,
                    padding: "16px 18px",
                    position: "relative", overflow: "hidden",
                    cursor: "pointer",
                    transition: "border-color 0.2s",
                }}>
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#5A5865", marginBottom: 10 }}>
                        {c.label}
                    </div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 28, fontWeight: 700, color: "#EAEAEA", marginBottom: 6, lineHeight: 1 }}>
                        {c.value}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 600, color: c.color }}>
                            {c.change}
                        </span>
                        <span style={{ fontSize: 10, color: "#5A5865" }}>{c.pts}</span>
                    </div>
                    {/* Corner glow */}
                    <div style={{
                        position: "absolute", bottom: -15, right: -15,
                        width: 60, height: 60, borderRadius: "50%",
                        background: c.color, opacity: 0.07, filter: "blur(16px)",
                        pointerEvents: "none",
                    }} />
                </div>
            ))}
        </div>
    );
}
