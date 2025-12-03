import React from "react";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { connectToDatabase } from "@/database/mongoose";
import Balance from "@/database/balance.model";
import Portfolio from "@/database/models/portfolio.model";
import Transaction from "@/database/transaction.model";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import TradePageClient from "./TradePageClient";
import { getQuote } from "@/lib/actions/finnhub.actions";
// Removed unused Motion import
// Since this is a server component, we'll use a client wrapper for animations or just simple CSS classes for now to keep it simple as per plan, 
// but to use Framer Motion we need a client component wrapper. 
// Let's create a client wrapper for the content.

async function getTradeData(userId: string) {
    await connectToDatabase();

    // Fetch Balance
    let balanceDoc = await Balance.findOne({ userId });
    if (!balanceDoc) {
        balanceDoc = await Balance.create({ userId, amount: 100000 });
    }

    // Fetch Holdings
    const holdingsDocs = await Portfolio.find({ userId });
    const holdings = JSON.parse(JSON.stringify(holdingsDocs));

    // Fetch current prices for holdings to calculate real portfolio value
    let totalPortfolioValue = 0;
    const holdingsWithPrice = await Promise.all(holdings.map(async (h: any) => {
        const currentPrice = await getQuote(h.symbol);
        const price = currentPrice || h.avgPrice; // Fallback to avgPrice if fetch fails
        totalPortfolioValue += price * h.quantity;
        return { ...h, currentPrice: price };
    }));

    // Fetch Recent Transactions
    const transactionsDocs = await Transaction.find({ userId }).sort({ createdAt: -1 }).limit(10);

    return {
        balance: balanceDoc.amount,
        holdings: holdingsWithPrice,
        transactions: JSON.parse(JSON.stringify(transactionsDocs)),
        portfolioValue: totalPortfolioValue
    };
}

export default async function TradePage() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
        return <div>Please log in to trade.</div>;
    }

    const { balance, holdings, transactions, portfolioValue } = await getTradeData(session.user.id);

    return (
        <div className="container mx-auto p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-3xl font-bold">Trade Center</h1>

            {/* Account Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-gray-400 text-sm">Available Cash</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-green-400">
                            ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-gray-400 text-sm">Portfolio Value (Est.)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-gray-100">
                            ${portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">*Based on real-time market price</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Trading Form */}
                <div className="lg:col-span-1">
                    <TradePageClient balance={balance} />
                </div>

                {/* Holdings & Recent Activity */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                            <CardTitle className="text-gray-100">Your Holdings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-gray-700 hover:bg-transparent">
                                        <TableHead className="text-gray-400">Symbol</TableHead>
                                        <TableHead className="text-right text-gray-400">Shares</TableHead>
                                        <TableHead className="text-right text-gray-400">Avg Price</TableHead>
                                        <TableHead className="text-right text-gray-400">Current Price</TableHead>
                                        <TableHead className="text-right text-gray-400">Return</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {holdings.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center text-gray-500 py-4">No holdings</TableCell>
                                        </TableRow>
                                    ) : (
                                        holdings.map((h: any) => {
                                            const currentVal = h.currentPrice * h.quantity;
                                            const costBasis = h.avgPrice * h.quantity;
                                            const gainLoss = currentVal - costBasis;
                                            const gainLossPercent = (gainLoss / costBasis) * 100;
                                            const isPositive = gainLoss >= 0;

                                            return (
                                                <TableRow key={h.symbol} className="border-gray-700 hover:bg-gray-700/50">
                                                    <TableCell className="font-medium text-gray-200">{h.symbol}</TableCell>
                                                    <TableCell className="text-right text-gray-200">{h.quantity}</TableCell>
                                                    <TableCell className="text-right text-gray-200">${h.avgPrice.toFixed(2)}</TableCell>
                                                    <TableCell className="text-right text-gray-200">${h.currentPrice.toFixed(2)}</TableCell>
                                                    <TableCell className={`text-right ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                                                        {isPositive ? '+' : ''}{gainLossPercent.toFixed(2)}%
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                            <CardTitle className="text-gray-100">Recent Transactions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-gray-700 hover:bg-transparent">
                                        <TableHead className="text-gray-400">Type</TableHead>
                                        <TableHead className="text-gray-400">Symbol</TableHead>
                                        <TableHead className="text-right text-gray-400">Shares</TableHead>
                                        <TableHead className="text-right text-gray-400">Price</TableHead>
                                        <TableHead className="text-right text-gray-400">Total</TableHead>
                                        <TableHead className="text-right text-gray-400">Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {transactions.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center text-gray-500 py-4">No transactions yet</TableCell>
                                        </TableRow>
                                    ) : (
                                        transactions.map((t: any) => (
                                            <TableRow key={t._id} className="border-gray-700 hover:bg-gray-700/50">
                                                <TableCell className={`font-medium uppercase ${t.type === 'buy' ? 'text-green-400' : 'text-red-400'}`}>{t.type}</TableCell>
                                                <TableCell className="text-gray-200">{t.symbol}</TableCell>
                                                <TableCell className="text-right text-gray-200">{t.quantity}</TableCell>
                                                <TableCell className="text-right text-gray-200">${t.price.toFixed(2)}</TableCell>
                                                <TableCell className="text-right text-gray-200">${t.totalAmount.toFixed(2)}</TableCell>
                                                <TableCell className="text-right text-gray-400 text-xs">
                                                    {new Date(t.createdAt).toLocaleDateString()}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
