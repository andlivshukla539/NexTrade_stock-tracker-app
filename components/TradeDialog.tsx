"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import TransactionForm, { TransactionData } from "@/components/forms/TransactionForm";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface TradeDialogProps {
    symbol: string;
    currentPrice?: number;
}

export default function TradeDialog({ symbol, currentPrice }: TradeDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

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
            setOpen(false);
            router.refresh(); // Refresh to show updated portfolio/balance if visible
        } catch (error) {
            console.error("Trade error", error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded transition-colors">
                    Trade
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-gray-800 border-gray-700 text-gray-100">
                <DialogHeader>
                    <DialogTitle>Trade {symbol}</DialogTitle>
                </DialogHeader>
                <TransactionForm
                    onSubmit={handleTrade}
                    isLoading={loading}
                    defaultSymbol={symbol}
                    defaultPrice={currentPrice}
                />
            </DialogContent>
        </Dialog>
    );
}
