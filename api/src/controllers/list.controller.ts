import type { Request, Response } from "express";
import { ListCreatSchema } from "../schema";
import List from "../models/list.model";

/*
 * @desc Create a new list
 * @route POST /api/v1/lists
 */
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

/*
 * @desc Get all lists
 * @route GET /api/v1/lists
 */
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

/*
 * @desc Get a single list by ID
 * @route GET /api/v1/lists/:id
 */
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

/*
 * @desc Update a list by ID
 * @route PUT /api/v1/lists/:id
 */
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

/*
 * @desc Delete a list by ID
 * @route DELETE /api/v1/lists/:id
 */
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
