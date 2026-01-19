import React from "react";

import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { connectToDatabase } from "@/database/mongoose";
import Balance from "@/database/balance.model";
import Portfolio from "@/database/models/portfolio.model";
import { env } from "@/lib/env";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { PortfolioChart } from "@/components/portfolio/PortfolioChart";
import { DepositCard } from "@/components/portfolio/DepositCard";
import { Suspense } from "react";

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


                // ... inside getPortfolioData ...
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
        return <div>Please log in to view your portfolio.</div>;
    }

    const { balance, holdings } = await getPortfolioData(session.user.id);

    const totalCost = holdings.reduce(
        (acc, h) => acc + h.quantity * h.avgPrice,
        0
    );

    const totalValue = holdings.reduce(
        (acc, h) => acc + h.quantity * h.currentPrice,
        0
    );

    const totalPnL = totalValue - totalCost;
    const totalPnLPercent =
        totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">My Portfolio</h1>

                <div className="w-full md:w-auto">
                    <Suspense fallback={<div className="h-32 w-64 bg-gray-800 animate-pulse rounded-lg" />}>
                        <DepositCard currentBalance={balance} />
                    </Suspense>
                </div>
            </div>

            {/* Portfolio Chart */}
            <PortfolioChart holdings={holdings} />

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Total Equity */}
                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-gray-400">
                            Total Equity
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-100">
                            $
                            {(totalValue + balance).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Invested Value */}
                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-gray-400">
                            Invested Value
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-100">
                            $
                            {totalValue.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Total P&L */}
                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-gray-400">
                            Total P&L
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div
                            className={`text-2xl font-bold ${totalPnL >= 0
                                ? "text-green-500"
                                : "text-red-500"
                                }`}
                        >
                            $
                            {Math.abs(totalPnL).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}{" "}
                            ({totalPnLPercent.toFixed(2)}%)
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Holdings Table */}
            <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                    <CardTitle className="text-gray-100">Holdings</CardTitle>
                </CardHeader>

                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-gray-700">
                                <TableHead className="text-gray-400">
                                    Symbol
                                </TableHead>
                                <TableHead className="text-right text-gray-400">
                                    Quantity
                                </TableHead>
                                <TableHead className="text-right text-gray-400">
                                    Avg Price
                                </TableHead>
                                <TableHead className="text-right text-gray-400">
                                    Current Price
                                </TableHead>
                                <TableHead className="text-right text-gray-400">
                                    Value
                                </TableHead>
                                <TableHead className="text-right text-gray-400">
                                    P&L
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {holdings.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="text-center text-gray-500 py-8"
                                    >
                                        No holdings yet. Start trading!
                                    </TableCell>
                                </TableRow>
                            ) : (
                                holdings.map((holding, index) => {
                                    const value =
                                        holding.quantity *
                                        holding.currentPrice;

                                    const pnl =
                                        value -
                                        holding.quantity *
                                        holding.avgPrice;

                                    const pnlPercent =
                                        (pnl /
                                            (holding.quantity *
                                                holding.avgPrice)) *
                                        100;

                                    return (
                                        <TableRow
                                            key={`${holding.symbol}-${index}`}
                                            className="border-gray-700 hover:bg-gray-700/50"
                                        >
                                            <TableCell className="font-medium text-gray-200">
                                                {holding.symbol}
                                            </TableCell>

                                            <TableCell className="text-right text-gray-200">
                                                {holding.quantity}
                                            </TableCell>

                                            <TableCell className="text-right text-gray-200">
                                                $
                                                {holding.avgPrice.toFixed(2)}
                                            </TableCell>

                                            <TableCell className="text-right text-gray-200">
                                                $
                                                {holding.currentPrice.toFixed(
                                                    2
                                                )}
                                            </TableCell>

                                            <TableCell className="text-right text-gray-200">
                                                ${value.toFixed(2)}
                                            </TableCell>

                                            <TableCell
                                                className={`text-right ${pnl >= 0
                                                    ? "text-green-500"
                                                    : "text-red-500"
                                                    }`}
                                            >
                                                {pnl >= 0 ? "+" : "-"}$
                                                {Math.abs(pnl).toFixed(2)} (
                                                {pnlPercent.toFixed(2)}%)
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
