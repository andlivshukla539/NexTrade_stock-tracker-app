import { NextResponse } from "next/server";
import { connectToDatabase } from "@/database/mongoose";
import Alert from "@/database/alert.model";
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

        await connectToDatabase();
        const deletedAlert = await Alert.findOneAndDelete({
            _id: id,
            userId: session.user.id,
        });

        if (!deletedAlert) {
            return NextResponse.json({ error: "Alert not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Alert deleted" });
    } catch (error) {
        console.error("Error deleting alert:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
