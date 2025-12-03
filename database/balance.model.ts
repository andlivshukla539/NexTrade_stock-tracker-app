import { Schema, model, models } from "mongoose";

const BalanceSchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    amount: {
        type: Number,
        required: true,
        default: 100000, // Default $100k for new users
    },
}, { timestamps: true });

const Balance = models.Balance || model("Balance", BalanceSchema);

export default Balance;
