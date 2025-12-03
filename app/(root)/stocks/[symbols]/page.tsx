import TradingViewWidget from "@/components/TradingViewWidget";
import WatchlistButton from "@/components/WatchlistButton";
import StockNews from "@/components/StockNews";
import NewsSentiment from "@/components/NewsSentiment";
import TradeDialog from "@/components/TradeDialog";
import {
    SYMBOL_INFO_WIDGET_CONFIG,
    CANDLE_CHART_WIDGET_CONFIG,
    BASELINE_WIDGET_CONFIG,
    TECHNICAL_ANALYSIS_WIDGET_CONFIG,
    COMPANY_PROFILE_WIDGET_CONFIG,
    COMPANY_FINANCIALS_WIDGET_CONFIG,
}
    from "@/lib/constants";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { getWatchlistSymbolsByEmail } from "@/lib/actions/watchlist.actions";

export default async function StockDetails({ params }: StockDetailsPageProps) {
    const { symbols } = await params;
    const sym = typeof symbols === 'string' ? symbols : '';
    const symUpper = sym ? sym.toUpperCase() : '';
    const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;

    // Determine initial watchlist status for current user
    let isInWatchlist = false;
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        const email = session?.user?.email as string | undefined;
        if (email && symUpper) {
            const symbolsList = await getWatchlistSymbolsByEmail(email);
            isInWatchlist = symbolsList.includes(symUpper);
        }
    } catch { }

    return (
        <div className="flex min-h-screen p-4 md:p-6 lg:p-8">
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                {/* Left column */}
                <div className="flex flex-col gap-6">
                    <TradingViewWidget
                        scriptUrl={`${scriptUrl}symbol-info.js`}
                        config={SYMBOL_INFO_WIDGET_CONFIG(sym)}
                        height={170}
                    />

                    <TradingViewWidget
                        scriptUrl={`${scriptUrl}advanced-chart.js`}
                        config={CANDLE_CHART_WIDGET_CONFIG(sym)}
                        className="custom-chart"
                        height={600}
                    />

                    <TradingViewWidget
                        scriptUrl={`${scriptUrl}advanced-chart.js`}
                        config={BASELINE_WIDGET_CONFIG(sym)}
                        className="custom-chart"
                        height={600}
                    />
                </div>

                {/* Right column */}
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <WatchlistButton symbol={symUpper} company={symUpper} isInWatchlist={isInWatchlist} />
                        <div className="flex gap-2">
                            <a
                                href={symUpper ? `/alerts/new?symbol=${encodeURIComponent(symUpper)}` : `/alerts/new`}
                                className="add-alert px-3 py-2 rounded-md bg-yellow-500 text-yellow-900 font-medium hover:opacity-90 transition"
                                aria-label={symUpper ? `Create price alert for ${symUpper}` : 'Create price alert'}
                            >
                                Add Alert
                            </a>
                            <TradeDialog symbol={symUpper} />
                        </div>
                    </div>

                    {/* Innovative: sentiment gauge derived from latest headlines */}
                    <NewsSentiment symbol={symUpper} />

                    <TradingViewWidget
                        scriptUrl={`${scriptUrl}technical-analysis.js`}
                        config={TECHNICAL_ANALYSIS_WIDGET_CONFIG(sym)}
                        height={400}
                    />

                    {/* Latest symbol news */}
                    <StockNews symbol={symUpper} />

                    <TradingViewWidget
                        scriptUrl={`${scriptUrl}company-profile.js`}
                        config={COMPANY_PROFILE_WIDGET_CONFIG(sym)}
                        height={440}
                    />

                    <TradingViewWidget
                        scriptUrl={`${scriptUrl}financials.js`}
                        config={COMPANY_FINANCIALS_WIDGET_CONFIG(sym)}
                        height={464}
                    />
                </div>
            </section>
        </div>
    );
}