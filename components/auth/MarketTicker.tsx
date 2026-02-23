'use client';

import { motion } from "framer-motion";

const tickerData = [
    { symbol: "AAPL", price: "189.84", change: "+1.24%", up: true },
    { symbol: "MSFT", price: "378.91", change: "+0.87%", up: true },
    { symbol: "GOOGL", price: "141.56", change: "-0.32%", up: false },
    { symbol: "AMZN", price: "178.25", change: "+2.15%", up: true },
    { symbol: "NVDA", price: "875.28", change: "+3.41%", up: true },
    { symbol: "TSLA", price: "248.42", change: "-1.18%", up: false },
    { symbol: "META", price: "505.78", change: "+1.56%", up: true },
    { symbol: "BTC", price: "67,284", change: "+4.2%", up: true },
    { symbol: "ETH", price: "3,542", change: "+2.8%", up: true },
    { symbol: "JPM", price: "198.34", change: "+0.45%", up: true },
];

export function MarketTicker() {
    const items = [...tickerData, ...tickerData];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="absolute bottom-0 left-0 right-0 z-20 overflow-hidden border-t border-surface-200/50 dark:border-white/[0.04] bg-white/50 dark:bg-surface-950/60 backdrop-blur-md"
        >
            <div className="flex animate-[ticker_40s_linear_infinite]" style={{ width: "max-content" }}>
                {items.map((item, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-3 px-6 py-2.5 border-r border-surface-100 dark:border-white/[0.04]"
                    >
                        <span className="text-[11px] font-bold text-surface-700 dark:text-surface-300 tracking-wide">
                            {item.symbol}
                        </span>
                        <span className="text-[11px] text-surface-500 dark:text-surface-400 font-mono">
                            ${item.price}
                        </span>
                        <span
                            className={`text-[10px] font-semibold ${item.up
                                    ? "text-emerald-500 dark:text-emerald-400"
                                    : "text-red-500 dark:text-red-400"
                                }`}
                        >
                            {item.up ? "▲" : "▼"} {item.change}
                        </span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
