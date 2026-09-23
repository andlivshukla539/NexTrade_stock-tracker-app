import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        // Prisma doesn't have a single "findOneAndDelete" that doesn't throw if not found, 
        // so we check if it belongs to user first, then delete. Or use deleteMany which doesn't throw.
        const deletedAlert = await prisma.alert.deleteMany({
            where: {
                id: id,
                userId: session.user.id,
            }
        });

        if (deletedAlert.count === 0) {
            return NextResponse.json({ error: "Alert not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Alert deleted" });
    } catch (error) {
        console.error("Error deleting alert:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
