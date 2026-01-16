import React from 'react'

import TradingViewWidget from "@/components/TradingViewWidget";
import {
    HEATMAP_WIDGET_CONFIG,
    MARKET_DATA_WIDGET_CONFIG,
    MARKET_OVERVIEW_WIDGET_CONFIG,
    TOP_STORIES_WIDGET_CONFIG
} from "@/lib/constants";
import TopMovers from "@/components/dashboard/TopMovers";
import SentimentRadar from "@/components/dashboard/SentimentRadar";
import SectorPerformance from "@/components/dashboard/SectorPerformance";
import AnimatedSection from "@/components/common/AnimatedSection";

const Home = () => {
    const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;

    return (
        <div className="flex flex-col gap-10 min-h-screen home-wrapper">
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
                {/* Column 1: AI Summary + Sentiment */}
                <div className="space-y-4 md:col-span-1 xl:col-span-1">
                    <SentimentRadar />
                </div>

                {/* Column 2: Top Movers */}
                <div className="md:col-span-1 xl:col-span-1">
                    <TopMovers />
                </div>

                {/* Column 3: Sector Performance */}
                <div className="md:col-span-1 xl:col-span-1">
                    <SectorPerformance />
                </div>
            </AnimatedSection>
        </div>
    )
}

export default Home;