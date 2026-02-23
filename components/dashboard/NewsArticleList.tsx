'use client';

function sentimentColor(text: string) {
    const t = text.toLowerCase();
    if (t.includes("surge") || t.includes("beat") || t.includes("gain") || t.includes("rise") || t.includes("exceed")) return "#2ECC8A";
    if (t.includes("drop") || t.includes("fall") || t.includes("weak") || t.includes("below") || t.includes("miss") || t.includes("loss")) return "#F0524F";
    return "#4E9EFF";
}

export default function NewsArticleList({ news }: { news: MarketNewsArticle[] }) {
    if (news.length === 0) {
        return <div style={{ padding: 24, textAlign: "center", color: "#5A5865", fontSize: 13 }}>No articles available right now.</div>;
    }

    return (
        <>
            {news.map((n, i) => {
                const col = sentimentColor(n.headline || "");
                const dt = n.datetime
                    ? new Date(n.datetime * 1000).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
                    : "";
                return (
                    <a
                        key={`${n.id}-${i}`}
                        href={n.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: "flex", gap: 12, padding: "14px 16px",
                            borderBottom: "1px solid rgba(255,255,255,0.05)",
                            textDecoration: "none", transition: "background 0.12s",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = "#131316")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: col, flexShrink: 0, marginTop: 5 }} />
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 500, color: "#EAEAEA", lineHeight: 1.45, marginBottom: 4 }}>{n.headline}</div>
                            {n.summary && (
                                <div style={{ fontSize: 11, color: "#5A5865", lineHeight: 1.4, marginBottom: 4 }}>
                                    {n.summary.substring(0, 140)}…
                                </div>
                            )}
                            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                {n.source && (
                                    <span style={{ fontSize: 9, background: "#1A1A1E", padding: "2px 6px", borderRadius: 4, color: "#5A5865" }}>
                                        {n.source}
                                    </span>
                                )}
                                {dt && <span style={{ fontSize: 9, color: "#3D3B45" }}>{dt}</span>}
                            </div>
                        </div>
                    </a>
                );
            })}
        </>
    );
}
