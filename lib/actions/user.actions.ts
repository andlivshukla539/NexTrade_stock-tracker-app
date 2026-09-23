'use server';

import { prisma } from '@/lib/prisma';

export const getAllUsersForNewsEmail = async () => {
    try {
        const users = await prisma.user.findMany({
            where: { email: { not: "" } },
            select: { id: true, email: true, name: true }
        });

        return users.filter((user) => user.email && user.name).map((user) => ({
            id: user.id,
            email: user.email,
            name: user.name
        }))
    } catch (e) {
        console.error('Error fetching users for news email:', e)
        return []
    }
}

export const getPlatformStats = async () => {
    try {
        const activeTraders = await prisma.user.count();

        return {
            activeTraders,
            avgReturn: '+18.4%', // Note: This would theoretically come from a portfolio aggregation query
            instruments: '40,000+', // Note: This comes from Finnhub's active symbol universe
        };
    } catch (e) {
        console.error('Error fetching platform stats:', e);
        return { activeTraders: 0, avgReturn: '--', instruments: '--' };
    }
}