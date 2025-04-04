import type { Request, Response } from "express";
import z from "zod";
import Sequence from "../models/sequence.model";

const PerformanceSchema = z.object({
  sent: z.number().default(0),
  opened: z.number().default(0),
  clicks: z.number().default(0),
  replies: z.number().default(0),
});
const SequenceSchema = z.object({
  name: z.string(),
  status: z.string().default("draft"),
  performance: PerformanceSchema,
});

export const createSequence = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const parsedData = SequenceSchema.parse(req.body);
    const newSequence = new Sequence({
      user: req.userId,
      name: parsedData.name,
      status: parsedData.status,
      performance: parsedData.performance,
    });
    const savedSequence = await newSequence.save();
    res.status(201).json(savedSequence);
  } catch (error) {
    res.status(500).json({ message: "Error creating sequence", error });
  }
};
// Get all sequences
export const getSequences = async (req: Request, res: Response) => {
  try {
    const sequences = await Sequence.find({
      user: req.userId,
    })
      .select("_id name status performance")
      .lean();
    res.status(200).json(sequences);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sequences", error });
  }
};
// Get a single sequence by ID
export const getSequenceById = async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      res.status(400).json({ message: "Sequence ID is required" });
      return;
    }
    const sequence = await Sequence.findOne({
      _id: req.params.id,
      user: req.userId,
    })
      .select("_id name status performance")
      .lean();
    if (!sequence) {
      res.status(404).json({ message: "Sequence not found" });
      return;
    }
    res.status(200).json(sequence);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sequence", error });
  }
};
