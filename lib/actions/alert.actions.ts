'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/better-auth/auth';
import { headers } from 'next/headers';

export async function createAlert(data: {
    symbol: string;
    condition: string;
    targetPrice: number;
    frequency: string;
}) {
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user?.id as string | undefined;
    if (!userId) throw new Error('Not authenticated');

    const newAlert = await prisma.alert.create({
        data: {
            userId,
            symbol: data.symbol.toUpperCase().trim(),
            condition: data.condition,
            targetPrice: data.targetPrice,
            frequency: data.frequency,
            status: 'active',
        }
    });

    return { ok: true, alertId: newAlert.id } as const;
}

export async function getAlertsByEmail(email: string) {
    if (!email) return [];
    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });
        if (!user) return [];

        const items = await prisma.alert.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' }
        });

        return items.map(i => ({
            id: i.id,
            symbol: i.symbol,
            condition: i.condition,
            targetPrice: i.targetPrice,
            status: i.status as "active" | "triggered",
            frequency: i.frequency,
            createdAt: i.createdAt,
            triggeredAt: i.triggeredAt || undefined
        }));
    } catch (err) {
        console.error('getAlertsByEmail error:', err);
        return [];
    }
}

export async function removeAlert(alertId: string) {
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user?.id as string | undefined;
    if (!userId) throw new Error('Not authenticated');

    await prisma.alert.deleteMany({
        where: { id: alertId, userId }
    });
    return { ok: true } as const;
}
