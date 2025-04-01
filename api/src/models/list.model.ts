import mongoose, { Schema, Document } from "mongoose";
import User from "./user.model";

interface IList extends Document {
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

const ListSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: User, required: true },
    listName: { type: String, required: true },
    leads: [
      {
        firstName: { type: String },
        lastName: { type: String },
        email: { type: String, required: true },
        company: { type: String },
        phone: { type: String },
        address: { type: String },
        city: { type: String },
        state: { type: String },
        zip: { type: String },
        country: { type: String },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const List = mongoose.models.List || mongoose.model<IList>("List", ListSchema);

export default List;
