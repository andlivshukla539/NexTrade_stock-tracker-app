const TICKS = [
    { sym: "NVDA", price: "875.40", chg: "+2.31%", up: true },
    { sym: "AAPL", price: "213.07", chg: "+0.94%", up: true },
    { sym: "TSLA", price: "248.50", chg: "−1.22%", up: false },
    { sym: "MSFT", price: "415.32", chg: "+0.69%", up: true },
    { sym: "SPY", price: "538.91", chg: "+0.41%", up: true },
    { sym: "AMD", price: "172.80", chg: "−0.58%", up: false },
    { sym: "GOOG", price: "177.23", chg: "+1.04%", up: true },
    { sym: "META", price: "519.60", chg: "+1.87%", up: true },
    { sym: "AMZN", price: "191.05", chg: "+0.33%", up: true },
    { sym: "BTC", price: "67,240", chg: "+3.11%", up: true },
    { sym: "JPM", price: "310.79", chg: "+0.89%", up: true },
    { sym: "WFC", price: "88.70", chg: "+1.29%", up: true },
    { sym: "BAC", price: "53.06", chg: "+0.55%", up: true },
];

export default function TickerBar() {
    const doubled = [...TICKS, ...TICKS];

    return (
        <div style={{
            height: 34,
            background: "#0D0D10",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            overflow: "hidden",
            flexShrink: 0,
        }}>
            <div style={{
                display: "flex",
                animation: "ticker 40s linear infinite",
                whiteSpace: "nowrap",
            }}>
                {doubled.map((t, i) => (
                    <span key={i} style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "0 20px",
                        borderRight: "1px solid rgba(255,255,255,0.06)",
                        fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                        fontSize: 11,
                    }}>
                        <span style={{ color: "#5A5865" }}>{t.sym}</span>
                        <span style={{ color: "#9896A0" }}>{t.price}</span>
                        <span style={{ color: t.up ? "#2ECC8A" : "#F0524F" }}>{t.chg}</span>
                    </span>
                ))}
            </div>
        </div>
    );
}
