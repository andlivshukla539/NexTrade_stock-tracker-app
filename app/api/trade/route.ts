import { NextResponse } from "next/server";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { connectToDatabase } from "@/database/mongoose";
import Balance from "@/database/balance.model";
import Portfolio from "@/database/models/portfolio.model";
import Transaction from "@/database/transaction.model";

export async function POST(req: Request) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;
        const { symbol, quantity, price, type } = await req.json();

        if (!symbol || !quantity || !price || !type) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        await connectToDatabase();

        // 1. Get or Create Balance
        let balance = await Balance.findOne({ userId });
        if (!balance) {
            balance = await Balance.create({ userId, amount: 100000 }); // Initialize with $100k
        }

        const totalCost = quantity * price;

        if (type === "buy") {
            // CHECK BALANCE
            if (balance.amount < totalCost) {
                return NextResponse.json({ error: "Insufficient funds" }, { status: 400 });
            }

            // DEDUCT BALANCE
            balance.amount -= totalCost;
            await balance.save();

            // UPDATE PORTFOLIO
            let holding = await Portfolio.findOne({ userId, symbol });
            if (holding) {
                // Calculate new average price
                const totalValue = (holding.quantity * holding.avgPrice) + totalCost;
                const newQuantity = holding.quantity + quantity;
                holding.avgPrice = totalValue / newQuantity;
                holding.quantity = newQuantity;
                await holding.save();
            } else {
                await Portfolio.create({
                    userId,
                    symbol,
                    quantity,
                    avgPrice: price,
                });
            }

        } else if (type === "sell") {
            // CHECK PORTFOLIO
            const holding = await Portfolio.findOne({ userId, symbol });
            if (!holding || holding.quantity < quantity) {
                return NextResponse.json({ error: "Insufficient shares" }, { status: 400 });
            }

            // ADD BALANCE
            balance.amount += totalCost;
            await balance.save();

            // UPDATE PORTFOLIO
            holding.quantity -= quantity;
            if (holding.quantity <= 0) {
                await Portfolio.deleteOne({ _id: holding._id });
            } else {
                await holding.save();
            }
        } else {
            return NextResponse.json({ error: "Invalid transaction type" }, { status: 400 });
        }

        // LOG TRANSACTION
        await Transaction.create({
            userId,
            symbol,
            type,
            quantity,
            price,
            totalAmount: totalCost,
        });

        return NextResponse.json({ success: true, newBalance: balance.amount });

    } catch (error) {
        console.error("Trade Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
