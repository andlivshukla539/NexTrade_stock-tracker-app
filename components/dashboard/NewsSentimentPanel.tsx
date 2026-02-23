const TAGS = ["Fed Policy", "Rate Hike Risk", "Tech Selloff", "CPI Data", "Earnings Season"];

export default function NewsSentimentPanel() {
    return (
        <div style={{ background: "#0D0D10", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, color: "#F0EEE8" }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#F0524F", display: "inline-block" }} />
                    News Sentiment
                </div>
                <div style={{ display: "flex", background: "#131316", borderRadius: 8, padding: 3, gap: 2 }}>
                    {["Market", "Portfolio"].map((t, i) => (
                        <button key={t} style={{
                            padding: "4px 12px", borderRadius: 6, fontSize: 11, fontWeight: 600, border: "none", cursor: "pointer",
                            background: i === 0 ? "#1A1A1E" : "none",
                            color: i === 0 ? "#F0EEE8" : "#5A5865",
                        }}>{t}</button>
                    ))}
                </div>
            </div>
            <div style={{ padding: 14 }}>
                {/* Score row */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                    <div>
                        <div style={{ fontSize: 10, color: "#5A5865", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Overall Score</div>
                        <div style={{ fontSize: 20, fontWeight: 600, color: "#F0524F" }}>Bearish</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 28, fontWeight: 600, color: "#F0524F" }}>30</div>
                        <div style={{ fontSize: 10, color: "#5A5865" }}>/100</div>
                    </div>
                </div>
                {/* Bar labels */}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#5A5865", marginBottom: 4 }}>
                    <span>Bearish</span><span>Neutral</span><span>Bullish</span>
                </div>
                {/* Bar */}
                <div style={{ height: 6, background: "#1A1A1E", borderRadius: 6, overflow: "hidden", marginBottom: 14 }}>
                    <div style={{ height: "100%", width: "30%", borderRadius: 6, background: "linear-gradient(90deg,#F0524F,#E85A4F)" }} />
                </div>
                {/* Tags */}
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {TAGS.map(tag => (
                        <span key={tag} style={{ padding: "4px 10px", borderRadius: 100, fontSize: 10, fontWeight: 600, background: "#1A1A1E", color: "#5A5865", border: "1px solid rgba(255,255,255,0.06)" }}>
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
