import mongoose, { Schema, Document } from "mongoose";

interface IEmailSender extends Document {
  user: mongoose.Schema.Types.ObjectId;
  email: string;
  status: "active" | "inactive";
  smtp: {
    host: string;
    port: number;
    username: string;
    password: string;
    secure: boolean;
  };
}

const emailSenderSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User model
    email: { type: String, required: true, unique: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    smtp: {
      host: { type: String, required: true },
      port: { type: Number, required: true },
      username: { type: String, required: true },
      password: { type: String, required: true }, // Store encrypted in production
      secure: { type: Boolean, required: true },
    },
  },
  { timestamps: true }
);

const EmailSender = mongoose.model<IEmailSender>("EmailSender", emailSenderSchema);
export default EmailSender;
