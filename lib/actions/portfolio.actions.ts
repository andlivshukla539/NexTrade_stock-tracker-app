'use server';

import { connectToDatabase } from '@/database/mongoose';
import Portfolio from '@/database/models/portfolio.model';
import { Watchlist } from '@/database/models/watchlist.model';
import { auth } from '@/lib/better-auth/auth';
import { headers } from 'next/headers';

/**
 * Returns real portfolio summary for the currently signed-in user:
 * - totalInvested: sum of (qty × avgPrice) across all holdings
 * - holdingCount: distinct symbols held
 * - watchlistCount: number of symbols in their watchlist
 */
export async function getPortfolioSummary() {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        const userId = session?.user?.id;
        if (!userId) return { totalInvested: 0, holdingCount: 0, watchlistCount: 0 };

        await connectToDatabase();

        const [holdings, watchlistCount] = await Promise.all([
            Portfolio.find({ userId }).lean(),
            Watchlist.countDocuments({ userId }),
        ]);

        const totalInvested = holdings.reduce((sum, h) => sum + (h.quantity * h.avgPrice), 0);
        return {
            totalInvested,
            holdingCount: holdings.length,
            watchlistCount,
        };
    } catch (err) {
        console.error('getPortfolioSummary error:', err);
        return { totalInvested: 0, holdingCount: 0, watchlistCount: 0 };
    }
}
