'use server';

import { connectToDatabase } from '@/database/mongoose';
import Portfolio from '@/database/models/portfolio.model';
import Balance from '@/database/balance.model';
import Transaction from '@/database/transaction.model';
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

        await connectToDatabase();

        const totalAmount = quantity * price;

        // 1. Get or Create Balance
        let balanceDoc = await Balance.findOne({ userId });
        if (!balanceDoc) {
            balanceDoc = await Balance.create({ userId, amount: 100000 });
        }

        // 2. Process Buy
        if (type === 'buy') {
            if (balanceDoc.amount < totalAmount) {
                return { success: false, error: "Insufficient funds" };
            }
            // Deduct balance
            balanceDoc.amount -= totalAmount;
            await balanceDoc.save();

            // Update Holdings
            const holding = await Portfolio.findOne({ userId, symbol });
            if (holding) {
                const newQty = holding.quantity + quantity;
                const newAvgPrice = ((holding.quantity * holding.avgPrice) + totalAmount) / newQty;
                holding.quantity = newQty;
                holding.avgPrice = newAvgPrice;
                await holding.save();
            } else {
                await Portfolio.create({ userId, symbol, quantity, avgPrice: price });
            }
        }

        // 3. Process Sell
        else if (type === 'sell') {
            const holding = await Portfolio.findOne({ userId, symbol });
            if (!holding || holding.quantity < quantity) {
                return { success: false, error: "Insufficient shares to sell" };
            }

            // Add to balance
            balanceDoc.amount += totalAmount;
            await balanceDoc.save();

            // Deduct holding
            if (holding.quantity === quantity) {
                await Portfolio.deleteOne({ _id: holding._id });
            } else {
                holding.quantity -= quantity;
                await holding.save();
            }
        }

        // 4. Record Transaction
        await Transaction.create({
            userId,
            symbol,
            type,
            quantity,
            price,
            totalAmount
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

        await connectToDatabase();

        const history = await Transaction.find({ userId }).sort({ createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(history));
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

        await connectToDatabase();

        // Mongoose generic typing workaround
        const doc = await Balance.findOne({ userId }).lean() as { amount?: number } | { amount?: number }[] | null;

        if (doc && Array.isArray(doc)) {
            return doc[0]?.amount ?? 100000;
        } else if (doc) {
            return doc.amount ?? 100000;
        }

        return 100000;
    } catch (err) {
        console.error('getAvailableBalance error:', err);
        return 0;
    }
}
