import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";

export async function GET() {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const alerts = await prisma.alert.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' }
        });

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

        const newAlert = await prisma.alert.create({
            data: {
                userId: session.user.id,
                symbol: symbol.toUpperCase(),
                targetPrice,
                condition,
            }
        });

        return NextResponse.json(newAlert, { status: 201 });
    } catch (error) {
        console.error("Error creating alert:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
