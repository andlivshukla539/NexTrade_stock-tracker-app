import { Schema, model, models } from "mongoose";

const TransactionSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    symbol: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["buy", "sell"],
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
}, { timestamps: true });

const Transaction = models.Transaction || model("Transaction", TransactionSchema);

export default Transaction;
