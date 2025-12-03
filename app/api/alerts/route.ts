import { NextResponse } from "next/server";
import { connectToDatabase } from "@/database/mongoose";
import Alert from "@/database/alert.model";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";

export async function GET() {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();
        const alerts = await Alert.find({ userId: session.user.id }).sort({ createdAt: -1 });

        return NextResponse.json(alerts);
    } catch (error) {
        console.error("Error fetching alerts:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { symbol, targetPrice, condition } = body;

        if (!symbol || !targetPrice || !condition) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        await connectToDatabase();
        const newAlert = await Alert.create({
            userId: session.user.id,
            symbol: symbol.toUpperCase(),
            targetPrice,
            condition,
        });

        return NextResponse.json(newAlert, { status: 201 });
    } catch (error) {
        console.error("Error creating alert:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
