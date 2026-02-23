import { razorpay } from "@/lib/razorpay";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/better-auth/auth";

export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: req.headers,
        });

        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { amount } = await req.json();

        if (!amount || amount <= 0) {
            return new NextResponse("Invalid amount", { status: 400 });
        }

        // Razorpay expects amount in paise (smallest currency unit, like cents)
        const amountInPaise = Math.round(amount * 100);

        const order = await razorpay.orders.create({
            amount: amountInPaise,
            currency: "USD", // Or INR if preferred
            receipt: `rcpt_${session.user.id}_${Date.now()}`,
            notes: {
                userId: session.user.id,
                type: "deposit"
            }
        });

        return NextResponse.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency
        });

    } catch (error) {
        console.error("Razorpay order error:", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
