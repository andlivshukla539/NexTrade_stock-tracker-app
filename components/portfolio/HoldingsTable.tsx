"use client";

import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TradeModal } from "./TradeModal";
import { useRouter } from "next/navigation";

interface Holding {
    symbol: string;
    quantity: number;
    avgPrice: number;
    currentPrice: number;
}

export function HoldingsTable({ holdings, balance }: { holdings: Holding[], balance: number }) {
    const router = useRouter();

    const refreshData = () => {
        router.refresh(); // Refresh server component data
    };

    return (
        <Table>
            <TableHeader>
                <TableRow className="border-gray-700">
                    <TableHead className="text-gray-400">Symbol</TableHead>
                    <TableHead className="text-right text-gray-400">Quantity</TableHead>
                    <TableHead className="text-right text-gray-400">Avg Price</TableHead>
                    <TableHead className="text-right text-gray-400">Current Price</TableHead>
                    <TableHead className="text-right text-gray-400">Value</TableHead>
                    <TableHead className="text-right text-gray-400">P&L</TableHead>
                    <TableHead className="text-right text-gray-400">Actions</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {holdings.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                            No holdings yet. Search for a stock to buy!
                        </TableCell>
                    </TableRow>
                ) : (
                    holdings.map((holding, index) => {
                        const value = holding.quantity * holding.currentPrice;
                        const pnl = value - (holding.quantity * holding.avgPrice);
                        const pnlPercent = (pnl / (holding.quantity * holding.avgPrice)) * 100;

                        return (
                            <TableRow key={`${holding.symbol}-${index}`} className="border-gray-700 hover:bg-gray-700/50">
                                <TableCell className="font-medium text-gray-200">{holding.symbol}</TableCell>
                                <TableCell className="text-right text-gray-200">{holding.quantity}</TableCell>
                                <TableCell className="text-right text-gray-200">${holding.avgPrice.toFixed(2)}</TableCell>
                                <TableCell className="text-right text-gray-200">${holding.currentPrice.toFixed(2)}</TableCell>
                                <TableCell className="text-right text-gray-200">${value.toFixed(2)}</TableCell>
                                <TableCell className={`text-right ${pnl >= 0 ? "text-green-500" : "text-red-500"}`}>
                                    {pnl >= 0 ? "+" : "-"}${Math.abs(pnl).toFixed(2)} ({pnlPercent.toFixed(2)}%)
                                </TableCell>
                                <TableCell className="text-right flex justify-end gap-2">
                                    <TradeModal symbol={holding.symbol} currentPrice={holding.currentPrice} balance={balance} type="buy" onSuccess={refreshData} />
                                    <TradeModal symbol={holding.symbol} currentPrice={holding.currentPrice} balance={balance} type="sell" onSuccess={refreshData} />
                                </TableCell>
                            </TableRow>
                        );
                    })
                )}
            </TableBody>
        </Table>
    );
}
