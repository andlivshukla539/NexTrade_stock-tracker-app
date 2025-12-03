import { Schema, model, models } from "mongoose";

const AlertSchema = new Schema(
    {
        userId: { type: String, required: true },
        symbol: { type: String, required: true },
        targetPrice: { type: Number, required: true },
        condition: {
            type: String,
            enum: ["ABOVE", "BELOW"],
            required: true,
        },
        triggered: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Alert = models.Alert || model("Alert", AlertSchema);

export default Alert;
