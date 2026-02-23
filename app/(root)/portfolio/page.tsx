import React from "react";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { connectToDatabase } from "@/database/mongoose";
import Balance from "@/database/balance.model";
import Portfolio from "@/database/models/portfolio.model";
import { env } from "@/lib/env";

import { TradeCenterExecute } from "@/components/portfolio/TradeCenterExecute";
import { TradeCenterHoldings } from "@/components/portfolio/TradeCenterHoldings";
import { TradeCenterTransactions } from "@/components/portfolio/TradeCenterTransactions";
import "@/components/portfolio/trade-center.css";

async function getPortfolioData(userId: string) {
    await connectToDatabase();

    // Fetch Balance
    let balanceDoc = await Balance.findOne({ userId });
    if (!balanceDoc) {
        balanceDoc = await Balance.create({ userId, amount: 100000 });
    }

    // Fetch Holdings
    const holdingsDocs = await Portfolio.find({ userId });

    // Fetch current price
    const holdings = await Promise.all(
        holdingsDocs.map(async (doc) => {
            let currentPrice = doc.avgPrice;

            try {
                const res = await fetch(
                    `https://finnhub.io/api/v1/quote?symbol=${doc.symbol}&token=${env.NEXT_PUBLIC_FINNHUB_API_KEY}`,
                    { next: { revalidate: 60 } }
                );
                const data = await res.json();
                if (data.c) currentPrice = data.c;
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
        balance: balanceDoc.amount,
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
