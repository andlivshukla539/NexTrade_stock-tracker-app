import { getNews } from "@/lib/actions/finnhub.actions";
import AlertsList from "@/components/AlertsList";
import NewsArticleList from "@/components/dashboard/NewsArticleList";
import Link from "next/link";

export default async function AlertsPage() {
    let news: MarketNewsArticle[] = [];
    try {
        news = await getNews(["NVDA", "AAPL", "TSLA", "MSFT", "GOOG"]);
    } catch {
        news = [];
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: "100%" }}>

            {/* Page header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#5A5865", marginBottom: 6 }}>News Feed</div>
                    <h1 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 24, fontWeight: 800, color: "#EAEAEA", margin: 0 }}>
                        Market <span style={{ color: "#E8C547" }}>News</span>
                    </h1>
                </div>
                <Link href="/alerts/new" style={{
                    display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8,
                    background: "#E8C547", color: "#0A0A0C", fontWeight: 700, fontSize: 12, textDecoration: "none",
                }}>
                    + New Alert
                </Link>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 14 }}>

                {/* Live News Feed — uses client component for hover interactivity */}
                <div style={{ background: "#0F0F12", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, overflow: "hidden" }}>
                    <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#E8C547", display: "inline-block" }} />
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#EAEAEA" }}>Live Market News</span>
                        <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 100, background: "rgba(46,204,138,0.12)", color: "#2ECC8A", fontSize: 9, fontWeight: 700 }}>
                            <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#2ECC8A", display: "inline-block", animation: "pulse 1.5s ease-in-out infinite" }} />
                            LIVE
                        </span>
                    </div>
                    <NewsArticleList news={news} />
                </div>

                {/* Alerts panel */}
                <div style={{ background: "#0F0F12", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, overflow: "hidden", alignSelf: "start" }}>
                    <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#EAEAEA" }}>Price Alerts</span>
                    </div>
                    <div style={{ padding: 12 }}>
                        <AlertsList />
                    </div>
                </div>
            </div>
        </div>
    );
}

