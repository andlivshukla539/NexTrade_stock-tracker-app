'use client';

type Props = { news: MarketNewsArticle[] };

function sentimentColor(text: string) {
    const t = text.toLowerCase();
    if (t.includes("surge") || t.includes("beat") || t.includes("gain") || t.includes("rise") || t.includes("high") || t.includes("exceed")) return "#2ECC8A";
    if (t.includes("drop") || t.includes("fall") || t.includes("weak") || t.includes("below") || t.includes("miss") || t.includes("loss")) return "#F0524F";
    return "#4E9EFF";
}

function timeAgo(unix: number): string {
    const secs = Math.floor(Date.now() / 1000) - unix;
    if (secs < 60) return "Just now";
    if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
    if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
    return `${Math.floor(secs / 86400)}d ago`;
}

export default function LiveMarketNewsPanel({ news }: Props) {
    if (!news || news.length === 0) return null;

    return (
        <div style={{ background: "#0F0F12", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#E8C547", display: "inline-block" }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: "#EAEAEA" }}>Market News</span>
                <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 100, background: "rgba(46,204,138,0.12)", color: "#2ECC8A", fontSize: 9, fontWeight: 700 }}>
                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#2ECC8A", display: "inline-block", animation: "pulse 1.5s ease-in-out infinite" }} />
                    LIVE
                </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)" }}>
                {news.slice(0, 6).map((n, i) => {
                    const col = sentimentColor(n.headline || "");
                    const age = n.datetime ? timeAgo(n.datetime) : "";
                    return (
                        <a key={`${n.id}-${i}`} href={n.url} target="_blank" rel="noopener noreferrer" style={{
                            display: "flex", gap: 10, padding: "12px 14px",
                            borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.04)" : "none",
                            borderRight: i % 3 < 2 ? "1px solid rgba(255,255,255,0.04)" : "none",
                            textDecoration: "none", transition: "background 0.12s",
                        }}
                            onMouseEnter={e => (e.currentTarget.style.background = "#131316")}
                            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                        >
                            <div style={{ width: 7, height: 7, borderRadius: "50%", background: col, flexShrink: 0, marginTop: 4 }} />
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 12, fontWeight: 500, color: "#EAEAEA", lineHeight: 1.4, marginBottom: 4 }}>{n.headline}</div>
                                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                    {n.source && <span style={{ fontSize: 9, background: col + "22", color: col, padding: "1px 5px", borderRadius: 4, fontWeight: 600 }}>{n.source}</span>}
                                    {age && <span style={{ fontSize: 9, color: "#3D3B45" }}>{age}</span>}
                                </div>
                            </div>
                        </a>
                    );
                })}
            </div>
        </div>
    );
}
