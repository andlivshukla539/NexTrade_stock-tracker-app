import StockOrbLoader from "@/components/hero/StockOrbLoader";
import TradingViewWidget from "@/components/TradingViewWidget";
import {
    HEATMAP_WIDGET_CONFIG,
    MARKET_DATA_WIDGET_CONFIG,
    MARKET_OVERVIEW_WIDGET_CONFIG,
    TOP_STORIES_WIDGET_CONFIG,
} from "@/lib/constants";
import TopMovers from "@/components/dashboard/TopMovers";
import SentimentRadar from "@/components/dashboard/SentimentRadar";
import SectorPerformance from "@/components/dashboard/SectorPerformance";
import AnimatedSection from "@/components/common/AnimatedSection";

const Home = () => {
    const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;

    return (
        <div className="flex flex-col gap-0 min-h-screen">
            {/* ================= HERO SECTION ================= */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#050505] via-[#0a0a0a] to-[#050505]">
                <div className="absolute inset-0 z-0">
                    <StockOrbLoader />
                </div>

                <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                        The Future of
                        <br />
                        <span className="neon-accent-green">Stock Trading</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8">
                        Experience real-time market insights with immersive 3D
                        visualization and AI-powered analytics.
                    </p>
                    <button className="px-8 py-4 bg-[#2AFF9D] text-black font-semibold rounded-lg hover:bg-[#25e08b] transition-all duration-200 hover:scale-105 active:scale-95">
                        Start Trading
                    </button>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex items-start justify-center p-2">
                        <div className="w-1.5 h-3 bg-gray-400 rounded-full" />
                    </div>
                </div>
            </section>

            {/* ================= DATA VISUALIZATION ================= */}
            <div className="home-wrapper px-6 py-20 space-y-16">
                <AnimatedSection className="xl:grid-cols-3">
                    <div className="md:col-span-1 xl:col-span-1 min-h-[600px]">
                        <TradingViewWidget
                            title="Market Overview"
                            scriptUrl={`${scriptUrl}market-overview.js`}
                            config={MARKET_OVERVIEW_WIDGET_CONFIG}
                            className="custom-chart"
                            height={600}
                        />
                    </div>
                    <div className="md:col-span-1 xl:col-span-2 min-h-[600px]">
                        <TradingViewWidget
                            title="Stock Heatmap"
                            scriptUrl={`${scriptUrl}stock-heatmap.js`}
                            config={HEATMAP_WIDGET_CONFIG}
                            height={600}
                        />
                    </div>
                </AnimatedSection>

                <AnimatedSection className="xl:grid-cols-3">
                    <div className="h-full md:col-span-1 xl:col-span-1 min-h-[600px]">
                        <TradingViewWidget
                            scriptUrl={`${scriptUrl}timeline.js`}
                            config={TOP_STORIES_WIDGET_CONFIG}
                            height={600}
                        />
                    </div>
                    <div className="h-full md:col-span-1 xl:col-span-2 min-h-[600px]">
                        <TradingViewWidget
                            scriptUrl={`${scriptUrl}market-quotes.js`}
                            config={MARKET_DATA_WIDGET_CONFIG}
                            height={600}
                        />
                    </div>
                </AnimatedSection>

                {/* Hybrid AI + Analytics Section */}
                <AnimatedSection>
                    <div className="space-y-4 md:col-span-1 xl:col-span-1">
                        <SentimentRadar />
                    </div>

                    <div className="md:col-span-1 xl:col-span-1">
                        <TopMovers />
                    </div>

                    <div className="md:col-span-1 xl:col-span-1">
                        <SectorPerformance />
                    </div>
                </AnimatedSection>
            </div>
        </div>
    );
};

export default Home;