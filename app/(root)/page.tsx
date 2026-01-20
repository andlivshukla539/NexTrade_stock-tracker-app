import TradingViewWidget from "@/components/TradingViewWidget";
import {
    HEATMAP_WIDGET_CONFIG,
    MARKET_DATA_WIDGET_CONFIG,
    MARKET_OVERVIEW_WIDGET_CONFIG,
    // TOP_STORIES_WIDGET_CONFIG, // Removed
    TOP_GAINERS_WIDGET_CONFIG,
    SECTOR_PERFORMANCE_WIDGET_CONFIG
} from "@/lib/constants";
import NewsSentiment from "@/components/NewsSentiment";
// import AlertsList from "@/components/AlertsList"; // Removed
// import StockNews from "@/components/StockNews"; // Removed

const Home = () => {
    const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;

    return (
        <div className="flex flex-col min-h-screen home-wrapper gap-8 pb-10">
            <section className="grid w-full gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 home-section">
                <div className="md:col-span-1 xl:col-span-1">
                    <TradingViewWidget
                        title="Market Overview"
                        scriptUrl={`${scriptUrl}market-overview.js`}
                        config={MARKET_OVERVIEW_WIDGET_CONFIG}
                        className="custom-chart"
                        height={600}
                    />
                </div>
                <div className="md:col-span-1 xl:col-span-2">
                    <TradingViewWidget
                        title="Stock Heatmap"
                        scriptUrl={`${scriptUrl}stock-heatmap.js`}
                        config={HEATMAP_WIDGET_CONFIG}
                        height={600}
                    />
                </div>
            </section>

            <section className="grid w-full gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 home-section">
                <div className="h-full md:col-span-1 xl:col-span-1">
                    <TradingViewWidget
                        title="Top Gainers"
                        scriptUrl={`${scriptUrl}hotlists.js`}
                        config={TOP_GAINERS_WIDGET_CONFIG}
                        height={600}
                    />
                </div>
                <div className="h-full md:col-span-1 xl:col-span-2">
                    <TradingViewWidget
                        title="Market Quotes"
                        scriptUrl={`${scriptUrl}market-quotes.js`}
                        config={MARKET_DATA_WIDGET_CONFIG}
                        height={600}
                    />
                </div>
            </section>

            {/* Sector & Sentiment Section */}
            <section className="grid w-full gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 home-section">
                <div className="md:col-span-1 xl:col-span-2">
                    <TradingViewWidget
                        title="Sector Performance"
                        scriptUrl={`${scriptUrl}market-quotes.js`}
                        config={SECTOR_PERFORMANCE_WIDGET_CONFIG}
                        height={600}
                    />
                </div>
                <div className="md:col-span-1 xl:col-span-1 h-full">
                    <NewsSentiment />
                </div>
            </section>
        </div>
    )
}

export default Home;
