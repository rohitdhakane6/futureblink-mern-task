import mongoose, { Schema, Document } from "mongoose";
import User from "./user.model";

interface IPerformance {
  sent: number;
  opened: number;
  clicks: number;
  replies: number;
}

interface ISequence extends Document {
  name: string;
  status: SequenceStatus;
  performance: IPerformance;
  flowChart: {
    nodes: any[]; // changed from any to any[]
    edges: any[]; // changed from any to any[]
  };
  user: mongoose.Schema.Types.ObjectId;
}

const performanceSchema: Schema = new Schema(
  {
    sent: { type: Number, default: 0 },
    opened: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    replies: { type: Number, default: 0 },
  },
  {
    _id: false,
  }
);

enum SequenceStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
}

const sequenceSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: User, required: true },
    name: { type: String, required: true },
    status: { type: String, enum: Object.values(SequenceStatus), required: true },
    performance: { type: performanceSchema, required: true },
    flowChart: {
      type: Object,
      default: { node: [], edges: [] },
    },
  },
  {
    timestamps: true,
  }
);

const Sequence = mongoose.model<ISequence>("Sequence", sequenceSchema);

export default Sequence;
