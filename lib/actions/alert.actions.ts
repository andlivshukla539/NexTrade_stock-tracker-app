'use server';

import { connectToDatabase } from '@/database/mongoose';
import { Alert } from '@/database/models/alert.model';
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

    await connectToDatabase();

    const newAlert = new Alert({
        userId,
        symbol: data.symbol.toUpperCase().trim(),
        condition: data.condition,
        targetPrice: data.targetPrice,
        frequency: data.frequency,
        status: 'active',
    });

    await newAlert.save();
    return { ok: true, alertId: String(newAlert._id) } as const;
}

export async function getAlertsByEmail(email: string) {
    if (!email) return [];
    try {
        const mongoose = await connectToDatabase();
        const db = mongoose.connection.db;
        if (!db) throw new Error('MongoDB connection not found');

        const user = await db.collection('user').findOne<{ _id?: unknown; id?: string; email?: string }>({ email });
        if (!user) return [];

        const userId = (user.id as string) || String(user._id || '');
        if (!userId) return [];

        const items = await Alert.find({ userId }).sort({ createdAt: -1 }).lean();

        return items.map(i => ({
            id: String(i._id),
            symbol: String(i.symbol),
            condition: String(i.condition),
            targetPrice: Number(i.targetPrice),
            status: String(i.status) as "active" | "triggered",
            frequency: String(i.frequency),
            createdAt: new Date(i.createdAt),
            triggeredAt: i.triggeredAt ? new Date(i.triggeredAt) : undefined
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

    await connectToDatabase();
    await Alert.deleteOne({ _id: alertId, userId });
    return { ok: true } as const;
}
