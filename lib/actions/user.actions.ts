'use server';

import { connectToDatabase } from "@/database/mongoose";

export const getAllUsersForNewsEmail = async () => {
    try {
        const mongoose = await connectToDatabase();
        const db = mongoose.connection.db;
        if (!db) throw new Error('Mongoose connection not connected');

        const users = await db.collection('user').find(
            { email: { $exists: true, $ne: null } },
            { projection: { _id: 1, id: 1, email: 1, name: 1, country: 1 } }
        ).toArray();

        return users.filter((user) => user.email && user.name).map((user) => ({
            id: user.id || user._id?.toString() || '',
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
        const mongoose = await connectToDatabase();
        if (!mongoose.connection.db) throw new Error('DB not connected');

        // Get actual user count
        const activeTraders = await mongoose.connection.db.collection('user').countDocuments();

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