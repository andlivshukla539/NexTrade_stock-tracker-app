"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface DepositCardProps {
    currentBalance: number;
}

export function DepositCard({ currentBalance }: DepositCardProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleDeposit = async () => {
        // Todo: Implement deposit logic
        // For now just console log as this is a UI fix for build
        console.log("Deposit clicked");
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
                    <Button
                        size="sm"
                        onClick={handleDeposit}
                        className="bg-green-500 hover:bg-green-600 text-white"
                        disabled={isLoading}
                    >
                        <Plus className="h-4 w-4 mr-1" /> Deposit
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
