import mongoose, { Schema, Document } from 'mongoose';

export interface IEmailTemplate extends Document {
    name: string;
    subject: string;
    body: string;
    createdAt: Date;
    updatedAt: Date;
}

const EmailTemplateSchema: Schema = new Schema(
    {
        createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
        name: { type: String, required: true, unique: true },
        subject: { type: String, required: true },
        body: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IEmailTemplate>('EmailTemplate', EmailTemplateSchema);