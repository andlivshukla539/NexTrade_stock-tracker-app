import { Suspense } from "react";
import IndexCards from "@/components/dashboard/IndexCards";
import MarketChartAndMovers from "@/components/dashboard/MarketChartAndMovers";
import StockHeatmap from "@/components/dashboard/StockHeatmap";
import SectorPerformancePanel from "@/components/dashboard/SectorPerformancePanel";
import LiveMarketNewsPanel from "@/components/dashboard/LiveMarketNewsPanel";
import { getNews } from "@/lib/actions/finnhub.actions";


// ── Async subcomponent: fetches live news independently so it doesn't block
// the fast-loading static sections (IndexCards, Chart, Heatmap)
async function LiveNews() {
    let news: MarketNewsArticle[] = [];
    try {
        news = await getNews(["NVDA", "AAPL", "TSLA", "MSFT", "META", "AMZN"]);
    } catch {
        news = [];
    }
    return <LiveMarketNewsPanel news={news} />;
}

// ── News fallback skeleton while live news loads
function NewsSkeleton() {
    return (
        <div style={{ background: "#0F0F12", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "14px 16px" }}>
            <div style={{ height: 12, width: 120, borderRadius: 6, background: "#1A1A1E", marginBottom: 12 }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1 }}>
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} style={{ padding: 12 }}>
                        <div style={{ height: 11, background: "#1A1A1E", borderRadius: 5, marginBottom: 6 }} />
                        <div style={{ height: 9, background: "#131316", borderRadius: 5, width: "70%" }} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default async function Home() {
    return (
        <>
            {/* Row 1: Fast — static data, no API wait */}
            <IndexCards />

            {/* Row 2: Fast — static data */}
            <MarketChartAndMovers />

            {/* Row 3: Fast — static data */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 240px", gap: 12 }}>
                <StockHeatmap />
                <SectorPerformancePanel />
            </div>

            {/* Row 4: Streamed separately via Suspense — doesn't block rows 1-3 */}
            <Suspense fallback={<NewsSkeleton />}>
                <LiveNews />
            </Suspense>
        </>
    );
}
