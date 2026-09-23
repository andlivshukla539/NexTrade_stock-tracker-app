'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/better-auth/auth';
import { headers } from 'next/headers';

export async function getWatchlistSymbolsByEmail(email: string, listName: string = "My Watchlist"): Promise<string[]> {
    if (!email) return [];

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) return [];

        const items = await prisma.watchlist.findMany({
            where: { userId: user.id, listName },
            select: { symbol: true }
        });
        return items.map((i) => i.symbol);
    } catch (err) {
        console.error('getWatchlistSymbolsByEmail error:', err);
        return [];
    }
}

// Server actions to mutate the watchlist for the currently authenticated user
export async function addToWatchlist(symbol: string, company: string, listName: string = "My Watchlist") {
    const sym = (symbol || '').toUpperCase().trim();
    const comp = (company || '').trim();
    const ln = (listName || '').trim();
    if (!sym || !comp || !ln) throw new Error('Invalid symbol/company/listName');

    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user?.id as string | undefined;
    if (!userId) throw new Error('Not authenticated');

    await prisma.watchlist.upsert({
        where: {
            userId_listName_symbol: {
                userId,
                listName: ln,
                symbol: sym
            }
        },
        update: {
            company: comp
        },
        create: {
            userId,
            listName: ln,
            symbol: sym,
            company: comp
        }
    });

    return { ok: true } as const;
}

export async function removeFromWatchlist(symbol: string, listName: string = "My Watchlist") {
    const sym = (symbol || '').toUpperCase().trim();
    const ln = (listName || '').trim();
    if (!sym || !ln) throw new Error('Invalid symbol/listName');

    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user?.id as string | undefined;
    if (!userId) throw new Error('Not authenticated');

    await prisma.watchlist.deleteMany({
        where: { userId, symbol: sym, listName: ln }
    });
    return { ok: true } as const;
}

export async function getWatchlistItemsByEmail(email: string) {
    if (!email) return [] as { symbol: string; company: string; listName: string; addedAt: Date }[];
    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });
        if (!user) return [];

        const items = await prisma.watchlist.findMany({
            where: { userId: user.id },
            select: { symbol: true, company: true, listName: true, addedAt: true }
        });
        return items;
    } catch (err) {
        console.error('getWatchlistItemsByEmail error:', err);
        return [];
    }
}