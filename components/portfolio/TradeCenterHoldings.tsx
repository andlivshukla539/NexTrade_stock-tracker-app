"use client";

import React, { useMemo } from "react";
import "./trade-center.css";

// Assuming same shape as existing HoldingsTable component props
interface Holding {
    symbol: string;
    quantity: number;
    avgPrice: number;
    currentPrice: number;
}

interface HoldingsTableProps {
    holdings: Holding[];
    balance: number;
}

export function TradeCenterHoldings({ holdings }: HoldingsTableProps) {
    const formattedHoldings = useMemo(() => {
        return holdings.map((h) => {
            const isPos = h.currentPrice >= h.avgPrice;
            const returnPct = h.avgPrice > 0 ? ((h.currentPrice - h.avgPrice) / h.avgPrice) * 100 : 0;
            const prefix = isPos ? "+" : "";

            // Generate a stable color based on character code like the mockup
            const colors = ['#4d9fff', '#ff6b6b', '#00e5a0', '#f0c040', '#a78bfa', '#fb923c'];
            const color = colors[h.symbol.charCodeAt(0) % colors.length];

            return {
                ...h,
                isPos,
                returnPct: returnPct.toFixed(2),
                prefix,
                color
            };
        });
    }, [holdings]);

    return (
        <div className="table-card">
            <div style={{ padding: "16px 20px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div className="card-title" style={{ margin: 0 }}>
                    <div className="card-title-dot" /> Your Holdings
                </div>
                <div style={{ fontSize: 10, color: "var(--muted)" }}>
                    {holdings.length} {holdings.length === 1 ? "position" : "positions"}
                </div>
            </div>

            <div className="table-head holdings-head">
                <div>Symbol</div>
                <div>Shares</div>
                <div>Avg Price</div>
                <div>Current</div>
                <div>Return</div>
            </div>

            <div>
                {formattedHoldings.length === 0 ? (
                    <div className="empty-state">
                        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                            <rect x="2" y="3" width="20" height="14" rx="2" />
                            <path d="M8 21h8M12 17v4" />
                        </svg>
                        No holdings yet
                    </div>
                ) : (
                    formattedHoldings.map((h) => (
                        <div key={h.symbol} className="table-row holdings-row">
                            <div className="holding-sym">
                                <div className="holding-badge" style={{ background: `${h.color}22`, color: h.color }}>
                                    {h.symbol.slice(0, 2)}
                                </div>
                                {h.symbol}
                            </div>
                            <div style={{ fontFamily: "var(--font-mono)" }}>{h.quantity}</div>
                            <div style={{ fontFamily: "var(--font-mono)" }}>
                                ${h.avgPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                            <div style={{ fontFamily: "var(--font-mono)" }}>
                                ${h.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                            <div>
                                <span className={`return-badge ${h.isPos ? 'pos' : 'neg'}`}>
                                    {h.isPos ? '▲' : '▼'} {h.prefix}{h.returnPct}%
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
