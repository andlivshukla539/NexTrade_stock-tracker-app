import TradingViewWidget from "@/components/TradingViewWidget";
import {
    MARKET_OVERVIEW_WIDGET_CONFIG,
    HEATMAP_WIDGET_CONFIG,
    MARKET_DATA_WIDGET_CONFIG,
} from "@/lib/constants";

export default function MarketsPage() {
    const scriptUrl = "https://s3.tradingview.com/external-embedding/embed-widget-";

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Header */}
            <div>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#5A5865", marginBottom: 6 }}>Markets</div>
                <h1 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 24, fontWeight: 800, color: "#EAEAEA", margin: 0 }}>
                    Market <span style={{ color: "#E8C547" }}>Overview</span>
                </h1>
            </div>

            {/* 2-col: market overview + heatmap */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <TradingViewWidget
                    title="Market Overview"
                    scriptUrl={`${scriptUrl}market-overview.js`}
                    config={MARKET_OVERVIEW_WIDGET_CONFIG}
                    className="custom-chart"
                    height={500}
                />
                <TradingViewWidget
                    title="Stock Heatmap"
                    scriptUrl={`${scriptUrl}stock-heatmap.js`}
                    config={HEATMAP_WIDGET_CONFIG}
                    height={500}
                />
            </div>

            {/* Market quotes full width */}
            <TradingViewWidget
                title="Market Quotes"
                scriptUrl={`${scriptUrl}market-quotes.js`}
                config={MARKET_DATA_WIDGET_CONFIG}
                height={500}
            />
        </div>
    );
}
