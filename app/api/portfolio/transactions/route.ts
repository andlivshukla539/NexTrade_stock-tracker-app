import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";

export async function GET(req: Request) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const url = new URL(req.url);
        const limitParam = url.searchParams.get("limit");
        const limit = limitParam ? parseInt(limitParam, 10) : 8;

        const transactions = await prisma.transaction.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' }, // Newest first
            take: limit
        });

        return NextResponse.json({ transactions });
    } catch (error) {
        console.error("Failed to fetch transactions:", error);
        return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
    }
}