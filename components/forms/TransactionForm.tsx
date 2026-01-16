"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

export interface TransactionData {
    symbol: string;
    quantity: number;
    price: number;
    type: "buy" | "sell";
}

interface TransactionFormProps {
    onSubmit: (data: TransactionData) => void;
    isLoading?: boolean;
    defaultSymbol?: string;
    defaultPrice?: number;
    currentPrice?: number | null;
    isFetchingPrice?: boolean;
    onSymbolChange?: (symbol: string) => void;
}

const TransactionForm = ({
    onSubmit,
    isLoading,
    defaultSymbol,
    defaultPrice,
    currentPrice,
    isFetchingPrice,
    onSymbolChange
}: TransactionFormProps) => {
    const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm({
        defaultValues: {
            symbol: defaultSymbol || "",
            quantity: "",
            price: defaultPrice || "",
        }
    });
    const [type, setType] = useState<"buy" | "sell">("buy");

    // Watch symbol changes
    const symbolValue = watch("symbol");

    useEffect(() => {
        if (onSymbolChange && symbolValue) {
            const timeoutId = setTimeout(() => {
                onSymbolChange(symbolValue);
            }, 500); // Debounce
            return () => clearTimeout(timeoutId);
        }
    }, [symbolValue, onSymbolChange]);

    // Update price field when currentPrice changes
    useEffect(() => {
        if (currentPrice) {
            setValue("price", currentPrice.toString());
        }
    }, [currentPrice, setValue]);

    const handleFormSubmit = (data: { symbol: string; quantity: string; price: string | number }) => {
        onSubmit({
            symbol: data.symbol,
            quantity: parseFloat(data.quantity),
            price: parseFloat(data.price.toString()),
            type
        });
        reset();
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="symbol" className="text-gray-100 font-medium">Stock Symbol</Label>
                <div className="relative">
                    <Input
                        id="symbol"
                        placeholder="AAPL"
                        {...register("symbol", { required: "Symbol is required" })}
                        className="uppercase bg-gray-950 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    />
                    {isFetchingPrice && (
                        <div className="absolute right-3 top-2.5">
                            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                        </div>
                    )}
                </div>
                {errors.symbol && (
                    <p className="text-sm text-red-500">{errors.symbol.message as string}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="type" className="text-gray-100 font-medium">Transaction Type</Label>
                <Select value={type} onValueChange={(value) => setType(value as "buy" | "sell")}>
                    <SelectTrigger className="w-full bg-gray-950 border-gray-600 text-white focus:ring-blue-500">
                        <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        <SelectItem value="buy" className="focus:bg-gray-800 focus:text-white cursor-pointer">Buy</SelectItem>
                        <SelectItem value="sell" className="focus:bg-gray-800 focus:text-white cursor-pointer">Sell</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="quantity" className="text-gray-100 font-medium">Quantity</Label>
                    <Input
                        id="quantity"
                        type="number"
                        step="0.01"
                        placeholder="0"
                        {...register("quantity", { required: "Quantity is required", min: 0.01 })}
                        className="bg-gray-950 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.quantity && (
                        <p className="text-sm text-red-500">{errors.quantity.message as string}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="price" className="text-gray-100 font-medium">
                        Price per Share
                        {currentPrice && <span className="text-xs text-green-400 ml-2">(Live)</span>}
                    </Label>
                    <Input
                        id="price"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...register("price", { required: "Price is required", min: 0.01 })}
                        readOnly={!!currentPrice} // Optional: prevent manual edit if live price exists
                        className={`bg-gray-950 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 ${currentPrice ? "bg-gray-900 cursor-not-allowed opacity-90" : ""}`}
                    />
                    {errors.price && (
                        <p className="text-sm text-red-500">{errors.price.message as string}</p>
                    )}
                </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading || isFetchingPrice}>
                {isLoading ? "Processing..." : type === "buy" ? "Buy Stock" : "Sell Stock"}
            </Button>
        </form>
    );
};

export default TransactionForm;
