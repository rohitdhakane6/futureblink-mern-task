import type { Request, Response } from "express";
import z from "zod";
import List from "../models/list.model";

const LeadsSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email(),
  company: z.string().optional(),
  phone: z.string().optional().or(z.number()),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional().or(z.number()),
  country: z.string().optional(),
});

const ListCreatSchema = z.object({
  listName: z.string(),
  leads: z.array(LeadsSchema),
});

export const createList = async (req: Request, res: Response) => {
  try {
    const parsedData = ListCreatSchema.parse(req.body);
    const newList = new List({
      user: req.userId,
      listName: parsedData.listName,
      leads: parsedData.leads,
    });
    const savedList = await newList.save();
    res.status(201).json(savedList);
  } catch (error) {
    res.status(500).json({ message: "Error creating list", error });
  }
};

// Get all lists
export const getLists = async (req: Request, res: Response) => {
  try {
    const lists = await List.find({
      user: req.userId,
    })
      .select("_id listName leads")
      .lean();
    res.status(200).json(lists);
  } catch (error) {
    res.status(500).json({ message: "Error fetching lists", error });
  }
};

// Get a single list by ID
export const getListById = async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      res.status(400).json({ message: "List ID is required" });
      return;
    }
    const list = await List.findOne({
      _id: req.params.id,
      user: req.userId,
    });
    if (!list) {
      res.status(404).json({ message: "List not found" });
      return;
    }
    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ message: "Error fetching list", error });
  }
};

// Update a list by ID
export const updateList = async (req: Request, res: Response) => {
  try {
    const updatedList = await List.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedList) {
      res.status(404).json({ message: "List not found" });
      return;
    }
    res.status(200).json(updatedList);
  } catch (error) {
    res.status(500).json({ message: "Error updating list", error });
  }
};

// Delete a list by ID
export const deleteList = async (req: Request, res: Response) => {
  try {
    const deletedList = await List.findByIdAndDelete(req.params.id);
    if (!deletedList) {
      res.status(404).json({ message: "List not found" });
      return;
    }
    res.status(200).json({ message: "List deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting list", error });
  }
};
