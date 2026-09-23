import React from "react";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getQuote } from "@/lib/actions/finnhub.actions";
import { TradeCenterExecute } from "@/components/portfolio/TradeCenterExecute";
import { TradeCenterHoldings } from "@/components/portfolio/TradeCenterHoldings";
import { TradeCenterTransactions } from "@/components/portfolio/TradeCenterTransactions";
import "./trade-center.css";

async function getPortfolioData(userId: string) {
    // Fetch or create Balance via Prisma
    let balanceRecord = await prisma.balance.findUnique({ where: { userId } });
    if (!balanceRecord) {
        balanceRecord = await prisma.balance.create({ data: { userId, amount: 100000 } });
    }

    // Fetch Holdings via Prisma
    const holdingsDocs = await prisma.portfolio.findMany({ where: { userId } });

    // Fetch current prices in parallel
    const holdings = await Promise.all(
        holdingsDocs.map(async (doc) => {
            let currentPrice = doc.avgPrice;
            try {
                const price = await getQuote(doc.symbol);
                if (price) currentPrice = price;
            } catch (e) {
                console.error(`Failed to fetch price for ${doc.symbol}`, e);
            }

            return {
                symbol: doc.symbol,
                quantity: doc.quantity,
                avgPrice: doc.avgPrice,
                currentPrice,
            };
        })
    );

    return {
        balance: balanceRecord.amount,
        holdings,
    };
}

export default async function PortfolioPage() {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
        return <div className="p-6 text-white">Please log in to view the Trade Center.</div>;
    }

    const { balance, holdings } = await getPortfolioData(session.user.id);

    const totalValue = holdings.reduce(
        (acc, h) => acc + h.quantity * h.currentPrice,
        0
    );
    const estimatedPortfolioValue = totalValue + balance;

    const fmt = (n: number) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <div className="trade-center-theme" style={{ height: "100%" }}>
            <main className="main">
                <div className="page-title">Trade <span>Center</span></div>

                {/* STAT CARDS */}
                <div className="stat-row">
                    <div className="stat-card">
                        <div className="stat-label">Available Cash</div>
                        <div className="stat-val">${fmt(balance)}</div>
                        <div className="stat-sub">Ready to invest</div>
                        <div className="stat-glow"></div>
                    </div>
                    <div className="stat-card red-accent">
                        <div className="stat-label">Portfolio Value (Est.)</div>
                        <div className="stat-val neutral">${fmt(estimatedPortfolioValue)}</div>
                        <div className="stat-sub">*Based on real-time market price</div>
                        <div className="stat-glow red"></div>
                    </div>
                </div>

                {/* TRADE GRID */}
                <div className="trade-grid">
                    {/* LEFT: EXECUTE TRADE */}
                    <TradeCenterExecute availableCash={balance} />

                    {/* RIGHT: HOLDINGS + TRANSACTIONS */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <TradeCenterHoldings holdings={holdings} balance={balance} />
                        <TradeCenterTransactions />
                    </div>
                </div>
            </main>
        </div>
    );
}