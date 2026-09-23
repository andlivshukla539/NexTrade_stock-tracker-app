import React from "react";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import TradePageClient from "./TradePageClient";

interface Holding {
    symbol: string;
    quantity: number;
    avgPrice: number;
    currentPrice: number;
}

async function getTradeData(userId: string) {
    let balanceRecord = await prisma.balance.findUnique({ where: { userId } });
    if (!balanceRecord) {
        balanceRecord = await prisma.balance.create({ data: { userId, amount: 100000 } });
    }

    const transactions = await prisma.transaction.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });

    const holdingsMap: Record<string, { quantity: number; costBasis: number }> = {};
    transactions.forEach(t => {
        if (!holdingsMap[t.symbol]) {
            holdingsMap[t.symbol] = { quantity: 0, costBasis: 0 };
        }
        if (t.type.toLowerCase() === "buy") {
            holdingsMap[t.symbol].quantity += t.quantity;
            holdingsMap[t.symbol].costBasis += t.totalAmount;
        } else {
            const avgPrice = holdingsMap[t.symbol].quantity > 0
                ? holdingsMap[t.symbol].costBasis / holdingsMap[t.symbol].quantity
                : 0;
            holdingsMap[t.symbol].quantity -= t.quantity;
            holdingsMap[t.symbol].costBasis -= avgPrice * t.quantity;
        }
    });

    const activeHoldings: Holding[] = [];
    for (const [symbol, data] of Object.entries(holdingsMap)) {
        if (data.quantity > 0) {
            const avgPrice = data.costBasis / data.quantity;
            const currentPrice = 0;
            activeHoldings.push({
                symbol,
                quantity: data.quantity,
                avgPrice,
                currentPrice,
            });
        }
    }

    const portfolioValue = activeHoldings.reduce((sum, h) => sum + (h.quantity * h.currentPrice), 0);

    return {
        balance: balanceRecord.amount,
        transactions,
        holdings: activeHoldings,
        portfolioValue,
    };
}

const S = {
    card: { background: "var(--nt-surface)", border: "1px solid var(--nt-border)", borderRadius: 16, overflow: "hidden" as const },
    cardHead: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: "1px solid var(--nt-border)" },
    val: { fontFamily: "var(--font-mono)", fontSize: 28, fontWeight: 700, color: "var(--nt-txt)" },
    th: { textAlign: "right" as const, padding: "12px 18px", color: "var(--nt-txt3)", fontSize: 10, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em" },
    td: { textAlign: "right" as const, padding: "12px 18px", color: "var(--nt-txt2)", fontSize: 13, borderTop: "1px solid var(--nt-border)" }
};

export default async function TradePage() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
        return <div style={{ padding: 40, color: "var(--nt-txt3)", textAlign: "center" }}>Please log in to view the Trade Center.</div>;
    }

    const { balance, transactions, holdings, portfolioValue } = await getTradeData(session.user.id);

    return (
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 24px 60px", color: "var(--nt-txt)", fontFamily: "var(--font-syne)" }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 24, letterSpacing: "-0.02em" }}>Trade Center</h1>

            {/* Account Summary */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, marginBottom: 24 }}>
                <div style={{ ...S.card, padding: 24 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--nt-txt3)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>Available Cash</div>
                    <div style={{ ...S.val, color: "var(--nt-green)" }}>
                        ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                </div>
                <div style={{ ...S.card, padding: 24 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--nt-txt3)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>Portfolio Value (Est.)</div>
                    <div style={S.val}>
                        ${portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <p style={{ fontSize: 10, color: "var(--nt-txt4)", marginTop: 8 }}>*Based on real-time market price</p>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20 }}>
                {/* Trading Form */}
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <TradePageClient />
                </div>

                {/* Holdings & Recent Activity */}
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    <div style={S.card}>
                        <div style={S.cardHead}>
                            <div style={{ fontSize: 13, fontWeight: 700 }}>Your Holdings</div>
                        </div>
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr>
                                        <th style={{ ...S.th, textAlign: "left" }}>Symbol</th>
                                        <th style={S.th}>Shares</th>
                                        <th style={S.th}>Avg Price</th>
                                        <th style={S.th}>Current Price</th>
                                        <th style={S.th}>Return</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {holdings.length === 0 ? (
                                        <tr><td colSpan={5} style={{ ...S.td, textAlign: "center", padding: 30 }}>No holdings</td></tr>
                                    ) : (
                                        holdings.map((h: Holding) => {
                                            const currentVal = h.currentPrice * h.quantity;
                                            const costBasis = h.avgPrice * h.quantity;
                                            const gainLoss = currentVal - costBasis;
                                            const gainLossPercent = costBasis > 0 ? (gainLoss / costBasis) * 100 : 0;
                                            const isPositive = gainLoss >= 0;

                                            return (
                                                <tr key={h.symbol}>
                                                    <td style={{ ...S.td, textAlign: "left", fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--nt-txt)" }}>{h.symbol}</td>
                                                    <td style={{ ...S.td, fontFamily: "var(--font-mono)" }}>{h.quantity}</td>
                                                    <td style={{ ...S.td, fontFamily: "var(--font-mono)" }}>${h.avgPrice.toFixed(2)}</td>
                                                    <td style={{ ...S.td, fontFamily: "var(--font-mono)", color: "var(--nt-txt)" }}>${h.currentPrice.toFixed(2)}</td>
                                                    <td style={{ ...S.td, fontFamily: "var(--font-mono)", color: isPositive ? "var(--nt-green)" : "var(--nt-red)", fontWeight: 700 }}>
                                                        {isPositive ? '+' : ''}{gainLossPercent.toFixed(2)}%
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div style={S.card}>
                        <div style={S.cardHead}>
                            <div style={{ fontSize: 13, fontWeight: 700 }}>Recent Transactions</div>
                        </div>
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr>
                                        <th style={{ ...S.th, textAlign: "left" }}>Type</th>
                                        <th style={{ ...S.th, textAlign: "left" }}>Symbol</th>
                                        <th style={S.th}>Shares</th>
                                        <th style={S.th}>Price</th>
                                        <th style={S.th}>Total</th>
                                        <th style={S.th}>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.length === 0 ? (
                                        <tr><td colSpan={6} style={{ ...S.td, textAlign: "center", padding: 30 }}>No transactions yet</td></tr>
                                    ) : (
                                        transactions.map((t) => (
                                            <tr key={t.id}>
                                                <td style={{ ...S.td, textAlign: "left", fontWeight: 700, fontSize: 11, textTransform: "uppercase", color: t.type.toLowerCase() === 'buy' ? "var(--nt-green)" : "var(--nt-red)" }}>{t.type}</td>
                                                <td style={{ ...S.td, textAlign: "left", fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--nt-txt)" }}>{t.symbol}</td>
                                                <td style={{ ...S.td, fontFamily: "var(--font-mono)" }}>{t.quantity}</td>
                                                <td style={{ ...S.td, fontFamily: "var(--font-mono)" }}>${t.price.toFixed(2)}</td>
                                                <td style={{ ...S.td, fontFamily: "var(--font-mono)", color: "var(--nt-txt)" }}>${t.totalAmount.toFixed(2)}</td>
                                                <td style={{ ...S.td, fontSize: 11 }}>{new Date(t.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}