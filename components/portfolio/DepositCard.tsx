"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, CreditCard } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DepositCardProps {
    currentBalance: number;
}

export function DepositCard({ currentBalance }: DepositCardProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [amount, setAmount] = useState<string>("1000"); // default $1000

    useEffect(() => {
        // Load Razorpay Script dynamically
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handleDeposit = async () => {
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return;

        try {
            setIsLoading(true);

            // 1. Create an order on our backend
            const orderResponse = await fetch("/api/razorpay/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: Number(amount) }),
            });

            if (!orderResponse.ok) {
                throw new Error("Failed to initialize deposit");
            }

            const order = await orderResponse.json();

            // 2. Open Razorpay Checkout modal
            interface RazorpaySuccessResponse {
                razorpay_payment_id: string;
                razorpay_order_id: string;
                razorpay_signature: string;
            }

            interface RazorpayErrorResponse {
                error: {
                    description: string;
                };
            }

            // ... inside component ...

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
                amount: order.amount, // amount in paise
                currency: order.currency,
                name: "NexTrade",
                description: "Add funds to your simulated brokerage account.",
                order_id: order.orderId,
                handler: async function (response: RazorpaySuccessResponse) {
                    // 3. Verify Payment on Success
                    try {
                        const verifyRes = await fetch("/api/razorpay/verify", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_signature: response.razorpay_signature,
                                amount: Number(amount),
                            }),
                        });

                        if (verifyRes.ok) {
                            // On successful verification, reload to update UI/Balance
                            window.location.reload();
                        } else {
                            alert("Payment verification failed. Please contact support.");
                        }
                    } catch (err) {
                        console.error("Verification failed", err);
                    }
                },
                theme: {
                    color: "#22c55e", // Tailwind green-500
                },
            };

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const rzp = new (window as any).Razorpay(options);

            rzp.on("payment.failed", function (response: RazorpayErrorResponse) {
                alert(`Payment Failed: ${response.error.description}`);
            });

            rzp.open();

        } catch (error: unknown) {
            console.error(error);
            const msg = error instanceof Error ? error.message : "Unknown error";
            alert(`Error processing payment: ${msg}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="bg-gray-800 border-gray-700 h-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-400">Buying Power</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex justify-between items-center gap-4">
                    <div className="text-2xl font-bold text-gray-100">
                        ${currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                size="sm"
                                className="bg-green-500 hover:bg-green-600 text-white font-medium"
                            >
                                <Plus className="h-4 w-4 mr-1" /> Deposit
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md bg-gray-900 border-gray-800 text-white">
                            <DialogHeader>
                                <DialogTitle>Add Funds</DialogTitle>
                                <DialogDescription className="text-gray-400">
                                    Deposit simulated dollars into your trading account.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-col gap-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="amount" className="text-sm text-gray-300">Amount (USD)</Label>
                                    <Input
                                        id="amount"
                                        type="number"
                                        min="1"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="bg-gray-800 border-gray-700 focus:ring-green-500 text-white text-lg"
                                        placeholder="1000"
                                    />
                                </div>
                                <Button
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg mt-2"
                                    disabled={isLoading || !amount || Number(amount) <= 0}
                                    onClick={handleDeposit}
                                >
                                    {isLoading ? (
                                        "Processing..."
                                    ) : (
                                        <>
                                            <CreditCard className="mr-2 h-5 w-5" /> Checkout with Razorpay
                                        </>
                                    )}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardContent>
        </Card>
    );
}
