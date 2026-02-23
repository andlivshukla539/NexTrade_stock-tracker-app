import { Schema, model, models, type Document, type Model } from 'mongoose';

export interface AlertItem extends Document {
    userId: string;
    symbol: string;
    condition: 'Price Above' | 'Price Below' | 'Crosses Up' | 'Crosses Down' | '% Change >';
    targetPrice: number;
    status: 'active' | 'triggered';
    frequency: 'Once' | 'Every Time';
    createdAt: Date;
    triggeredAt?: Date;
}

const AlertSchema = new Schema<AlertItem>(
    {
        userId: { type: String, required: true, index: true },
        symbol: { type: String, required: true, uppercase: true, trim: true },
        condition: { type: String, required: true, enum: ['Price Above', 'Price Below', 'Crosses Up', 'Crosses Down', '% Change >'] },
        targetPrice: { type: Number, required: true },
        status: { type: String, required: true, enum: ['active', 'triggered'], default: 'active' },
        frequency: { type: String, required: true, enum: ['Once', 'Every Time'], default: 'Once' },
        createdAt: { type: Date, default: Date.now },
        triggeredAt: { type: Date },
    },
    { timestamps: false }
);

export const Alert: Model<AlertItem> =
    (models?.Alert as Model<AlertItem>) || model<AlertItem>('Alert', AlertSchema);
