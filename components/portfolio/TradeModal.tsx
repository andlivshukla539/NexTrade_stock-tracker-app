"use client";

import { useState } from "react";
import { executePaperTrade } from "@/lib/actions/trading.actions";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function TradeModal({ symbol, currentPrice, balance, type = 'buy', onSuccess }: {
    symbol: string;
    currentPrice: number;
    balance: number;
    type?: 'buy' | 'sell';
    onSuccess?: () => void;
}) {
    const [open, setOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const isBuy = type === 'buy';
    const totalCost = quantity * currentPrice;

    const handleTrade = async () => {
        setIsLoading(true);
        try {
            const res = await executePaperTrade({
                symbol,
                quantity,
                price: currentPrice,
                type
            });

            if (res.success) {
                toast.success(`Successfully ${isBuy ? 'bought' : 'sold'} ${quantity} shares of ${symbol}`);
                setOpen(false);
                if (onSuccess) onSuccess();
            } else {
                toast.error(res.error || "Trade failed");
            }
        } catch (error) {
            console.error(error);
            toast.error("An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={isBuy ? "default" : "outline"} size="sm" className={isBuy ? "bg-green-600 hover:bg-green-700 text-white" : "border-gray-600 text-white hover:bg-gray-800"}>
                    {isBuy ? 'Buy' : 'Sell'} {symbol}
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-800 text-white w-[90vw] max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">{isBuy ? 'Buy' : 'Sell'} {symbol}</DialogTitle>
                    <DialogDescription className="text-gray-400 text-sm">
                        Current Market Price: <span className="text-white font-mono">${currentPrice.toFixed(2)}</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="py-6 space-y-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-400">Shares</label>
                        <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center border border-gray-700 cursor-not-allowed">
                        <span className="text-gray-400">Estimated Total</span>
                        <span className="font-bold font-mono">${totalCost.toFixed(2)}</span>
                    </div>

                    {isBuy && (
                        <div className="text-xs text-right text-gray-500">
                            Available Balance: <span className={balance >= totalCost ? "text-green-500" : "text-red-500"}>${balance.toLocaleString()}</span>
                        </div>
                    )}
                </div>

                <div className="flex gap-3 mt-4">
                    <Button variant="outline" onClick={() => setOpen(false)} className="flex-1 border-gray-700 text-black hover:bg-gray-200" disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleTrade}
                        className={`flex-1 ${isBuy ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white`}
                        disabled={isLoading || (isBuy && totalCost > balance)}
                    >
                        {isLoading ? 'Processing...' : `Confirm ${isBuy ? 'Buy' : 'Sell'}`}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
