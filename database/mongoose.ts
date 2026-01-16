import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

declare global {
    var mongooseCache: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    }
}

let cached = global.mongooseCache;

if (!cached) {
    cached = global.mongooseCache = { conn: null, promise: null };
}

export const connectToDatabase = async () => {
    if (!MONGODB_URI) {
        throw new Error('MONGODB_URI environment variable is not set. Please check your .env file.');
    }

    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 20000, // Increased to 20s for dev reliability
            socketTimeoutMS: 45000,
        };
        cached.promise = mongoose.connect(MONGODB_URI, opts);
    }

    try {
        cached.conn = await cached.promise;
        console.log(`✅ Connected to MongoDB database (${process.env.NODE_ENV})`);
    } catch (err) {
        cached.promise = null;
        console.error('❌ MongoDB connection failed:', err);
        throw new Error(`Failed to connect to MongoDB: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }

    return cached.conn;
}