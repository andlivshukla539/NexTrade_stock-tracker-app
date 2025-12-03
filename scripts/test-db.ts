
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const MONGODB_URI = process.env.MONGODB_URI;

console.log('Testing MongoDB connection...');

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined in .env');
    process.exit(1);
}

// Mask the URI for safety in logs, showing only the host
const maskedURI = MONGODB_URI.replace(/:([^:@]+)@/, ':****@');
console.log(`Attempting to connect to: ${maskedURI}`);

const connect = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {
            bufferCommands: false,
            serverSelectionTimeoutMS: 5000,
        });
        console.log('✅ Successfully connected to MongoDB!');
        await mongoose.disconnect();
        console.log('Disconnected.');
    } catch (error) {
        console.error('❌ Connection failed!');
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        if (error.cause) console.error('Error cause:', error.cause);
        // console.error('Full error:', error);
    }
};

connect();