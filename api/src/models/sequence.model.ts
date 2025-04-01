import mongoose, { Schema, Document } from 'mongoose';

interface IPerformance {
  sent: number;
  opened: number;
  clicks: number;
  replies: number;
}

interface ISequence extends Document {
  name: string;
  status: string;
  performance: IPerformance;
}

const performanceSchema: Schema = new Schema({
  sent: { type: Number, default: 0 },
  opened: { type: Number, default: 0 },
  clicks: { type: Number, default: 0 },
  replies: { type: Number, default: 0 },
});

const sequenceSchema: Schema = new Schema({
  name: { type: String, required: true },
  status: { type: String, required: true },
  performance: { type: performanceSchema, required: true },
});

const Sequence = mongoose.model<ISequence>('Sequence', sequenceSchema);

export default Sequence;
