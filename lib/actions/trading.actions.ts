'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/better-auth/auth';
import { headers } from 'next/headers';

/**
 * Execute a paper trade (buy or sell)
 */
export async function executePaperTrade({
    symbol,
    quantity,
    price,
    type,
}: {
    symbol: string;
    quantity: number;
    price: number;
    type: 'buy' | 'sell';
}) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        const userId = session?.user?.id;
        if (!userId) throw new Error("Unauthorized");

        const totalAmount = quantity * price;

        // 1. Get or Create Balance
        let balanceDoc = await prisma.balance.findUnique({ where: { userId } });
        if (!balanceDoc) {
            balanceDoc = await prisma.balance.create({ data: { userId, amount: 100000 } });
        }

        // 2. Process Buy
        if (type === 'buy') {
            if (balanceDoc.amount < totalAmount) {
                return { success: false, error: "Insufficient funds" };
            }
            // Deduct balance
            await prisma.balance.update({
                where: { userId },
                data: { amount: balanceDoc.amount - totalAmount }
            });

            // Update Holdings
            const holdings = await prisma.portfolio.findMany({ where: { userId, symbol } });
            const holding = holdings[0];
            if (holding) {
                const newQty = holding.quantity + quantity;
                const newAvgPrice = ((holding.quantity * holding.avgPrice) + totalAmount) / newQty;
                await prisma.portfolio.update({
                    where: { id: holding.id },
                    data: { quantity: newQty, avgPrice: newAvgPrice }
                });
            } else {
                await prisma.portfolio.create({ data: { userId, symbol, quantity, avgPrice: price } });
            }
        }

        // 3. Process Sell
        else if (type === 'sell') {
            const holdings = await prisma.portfolio.findMany({ where: { userId, symbol } });
            const holding = holdings[0];
            if (!holding || holding.quantity < quantity) {
                return { success: false, error: "Insufficient shares to sell" };
            }

            // Add to balance
            await prisma.balance.update({
                where: { userId },
                data: { amount: balanceDoc.amount + totalAmount }
            });

            // Deduct holding
            if (holding.quantity === quantity) {
                await prisma.portfolio.delete({ where: { id: holding.id } });
            } else {
                await prisma.portfolio.update({
                    where: { id: holding.id },
                    data: { quantity: holding.quantity - quantity }
                });
            }
        }

        // 4. Record Transaction
        await prisma.transaction.create({
            data: {
                userId,
                symbol,
                type,
                quantity,
                price,
                totalAmount
            }
        });

        return { success: true };
    } catch (err: unknown) {
        console.error('executePaperTrade error:', err);
        return { success: false, error: err instanceof Error ? err.message : String(err) };
    }
}

/**
 * Fetch transaction history
 */
export async function getTransactionHistory() {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        const userId = session?.user?.id;
        if (!userId) return [];

        const history = await prisma.transaction.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
        return history;
    } catch (err) {
        console.error('getTransactionHistory error:', err);
        return [];
    }
}

/**
 * Fetch available balance
 */
export async function getAvailableBalance() {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        const userId = session?.user?.id;
        if (!userId) return 0;

        const doc = await prisma.balance.findUnique({ where: { userId } });
        return doc?.amount ?? 100000;
    } catch (err) {
        console.error('getAvailableBalance error:', err);
        return 0;
    }
}
