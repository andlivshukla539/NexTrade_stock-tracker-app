import { NextResponse } from "next/server";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

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

        // 1. Get or Create Balance
        let balance = await prisma.balance.findUnique({ where: { userId } });
        if (!balance) {
            balance = await prisma.balance.create({ data: { userId, amount: 100000 } }); // Initialize with $100k
        }

        const totalCost = quantity * price;

        if (type === "buy") {
            // CHECK BALANCE
            if (balance.amount < totalCost) {
                return NextResponse.json({ error: "Insufficient funds" }, { status: 400 });
            }

            // DEDUCT BALANCE
            balance = await prisma.balance.update({
                where: { userId },
                data: { amount: balance.amount - totalCost }
            });

            // UPDATE PORTFOLIO
            const holding = await prisma.portfolio.findFirst({ where: { userId, symbol } });
            if (holding) {
                // Calculate new average price
                const totalValue = (holding.quantity * holding.avgPrice) + totalCost;
                const newQuantity = holding.quantity + quantity;
                await prisma.portfolio.update({
                    where: { id: holding.id },
                    data: {
                        avgPrice: totalValue / newQuantity,
                        quantity: newQuantity
                    }
                });
            } else {
                await prisma.portfolio.create({
                    data: {
                        userId,
                        symbol,
                        quantity,
                        avgPrice: price,
                    }
                });
            }

        } else if (type === "sell") {
            // CHECK PORTFOLIO
            const holding = await prisma.portfolio.findFirst({ where: { userId, symbol } });
            if (!holding || holding.quantity < quantity) {
                return NextResponse.json({ error: "Insufficient shares" }, { status: 400 });
            }

            // ADD BALANCE
            balance = await prisma.balance.update({
                where: { userId },
                data: { amount: balance.amount + totalCost }
            });

            // UPDATE PORTFOLIO
            const newQuantity = holding.quantity - quantity;
            if (newQuantity <= 0) {
                await prisma.portfolio.delete({ where: { id: holding.id } });
            } else {
                await prisma.portfolio.update({
                    where: { id: holding.id },
                    data: { quantity: newQuantity }
                });
            }
        } else {
            return NextResponse.json({ error: "Invalid transaction type" }, { status: 400 });
        }

        // LOG TRANSACTION
        await prisma.transaction.create({
            data: {
                userId,
                symbol,
                type: type.toUpperCase(), // Assuming type maps to enum BUY/SELL
                quantity,
                price,
                totalAmount: totalCost,
            }
        });

        return NextResponse.json({ success: true, newBalance: balance.amount });

    } catch (error) {
        console.error("Trade Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
