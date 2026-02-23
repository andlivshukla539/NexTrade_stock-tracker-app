import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectToDatabase } from "@/database/mongoose";
import Balance from "@/database/balance.model";
import Transaction from "@/database/transaction.model";
import { auth } from "@/lib/better-auth/auth";

export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: req.headers,
        });

        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            amount // We pass this from the frontend for verification / db update
        } = await req.json();

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "placeholder_secret")
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Payment is successful and verified
            await connectToDatabase();
            const userId = session.user.id;

            // We expect the amount in dollars here.
            const depositAmount = Number(amount);

            // Update user's balance
            const balance = await Balance.findOne({ userId });
            if (balance) {
                balance.amount += depositAmount;
                await balance.save();
            } else {
                await Balance.create({
                    userId,
                    amount: depositAmount,
                });
            }

            // Record transaction
            await Transaction.create({
                userId,
                symbol: "USD",
                type: "deposit",
                quantity: depositAmount,
                price: 1,
                totalAmount: depositAmount,
            });

            return NextResponse.json({ success: true }, { status: 200 });
        } else {
            return NextResponse.json({ success: false, message: "Invalid signature" }, { status: 400 });
        }
    } catch (error) {
        console.error("Razorpay verify error:", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
