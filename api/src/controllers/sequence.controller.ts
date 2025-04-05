import type { Request, Response } from "express";
import { SequenceSchema, SequenceUpdateSchema } from "../schema";
import Sequence from "../models/sequence.model";
import { scheduleEmailSequence } from "../services/emailScheduler.service";

/**
 * @desc Create a new sequence
 * @route POST /api/v1/sequences
 */

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

/**
 * @desc Get all sequences
 * @route GET /api/v1/sequences
 */
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

/**
 * @desc Get a single sequence by ID
 * @route GET /api/v1/sequences/:id
 */

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
      .select("_id name status performance flowChart")
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

/**
 * @desc Delete a sequence by ID
 * @route DELETE /api/v1/sequences/:id
 */
export const updateSequence = async (req: Request, res: Response) => {
  try {
    const sequenceId = req.params.id;
    const userId = req.userId;

    if (!sequenceId) {
      return res.status(400).json({ message: "Sequence ID is required" });
    }

    const sequence = await Sequence.findOne({
      _id: sequenceId,
      user: userId,
    }).lean();
    if (!sequence) {
      return res.status(404).json({ message: "Sequence not found" });
    }

    const parsedData = SequenceUpdateSchema.parse(req.body);

    const updatedSequence = await Sequence.findByIdAndUpdate(
      sequenceId,
      {
        name: parsedData.name,
        status: parsedData.status,
        performance: parsedData.performance,
        flowChart: parsedData.flowChart,
      },
      { new: true }
    );

    if (!updatedSequence) {
      return res.status(404).json({ message: "Failed to update sequence" });
    }

    if (parsedData.status === "published") {
      try {
        await scheduleEmailSequence(updatedSequence, userId!);
      } catch (err: any) {
        console.error("❌ Error in scheduler service:", err.message);
        return res.status(500).json({ message: "Failed to schedule sequence" });
      }
    }

    return res.status(200).json({ message: "Sequence updated successfully" });
  } catch (err: any) {
    console.error("❌ Error:", err);
    if (err.name === "ZodError") {
      return res
        .status(400)
        .json({ message: "Invalid data", errors: err.errors });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};
