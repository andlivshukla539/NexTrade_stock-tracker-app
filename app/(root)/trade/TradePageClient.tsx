"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TransactionForm, { TransactionData } from "@/components/forms/TransactionForm";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getQuote } from "@/lib/actions/finnhub.actions";

export default function TradePageClient() {
    const [loading, setLoading] = useState(false);
    const [currentPrice, setCurrentPrice] = useState<number | null>(null);
    const [isFetchingPrice, setIsFetchingPrice] = useState(false);
    const router = useRouter();

    const handleSymbolChange = async (symbol: string) => {
        if (!symbol) {
            setCurrentPrice(null);
            return;
        }
        setIsFetchingPrice(true);
        try {
            const price = await getQuote(symbol);
            if (price) {
                setCurrentPrice(price);
            } else {
                setCurrentPrice(null);
                // Optional: toast.error("Could not fetch price for symbol");
            }
        } catch (error) {
            console.error("Error fetching quote:", error);
            setCurrentPrice(null);
        } finally {
            setIsFetchingPrice(false);
        }
    };

    const handleTrade = async (data: TransactionData) => {
        setLoading(true);
        try {
            const res = await fetch("/api/trade", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    symbol: data.symbol,
                    quantity: data.quantity,
                    price: data.price,
                    type: data.type,
                }),
            });

            const json = await res.json();

            if (!res.ok) {
                toast.error(json.error || "Trade failed");
                return;
            }

            toast.success(`Successfully ${data.type === "buy" ? "bought" : "sold"} ${data.quantity} shares of ${data.symbol}`);
            router.refresh();
            // Refresh price after trade
            handleSymbolChange(data.symbol);
        } catch (error) {
            console.error("Trade error", error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="bg-gray-800 border-gray-700 h-full">
            <CardHeader>
                <CardTitle className="text-gray-100">Execute Trade</CardTitle>
            </CardHeader>
            <CardContent>
                <TransactionForm
                    onSubmit={handleTrade}
                    isLoading={loading}
                    currentPrice={currentPrice}
                    isFetchingPrice={isFetchingPrice}
                    onSymbolChange={handleSymbolChange}
                />
            </CardContent>
        </Card>
    );
}
