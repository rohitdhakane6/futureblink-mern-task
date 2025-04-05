import type { Request, Response } from "express";
import z from "zod";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { RegisterSchema, LoginSchema } from "../schema";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

// TODO: add password hashing and

/*
 * @desc Register a new user
 * @route POST /api/v1/auth/register
 */
export const register = async (req: Request, res: Response) => {
  try {
    const parsedData = RegisterSchema.parse(req.body);
    const existingUser = await User.findOne({ email: parsedData.email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }
    const newUser = new User(parsedData);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

/**
 * @desc Login a user
 * @route POST /api/v1/auth/login
 */

export const login = async (req: Request, res: Response) => {
  try {
    const parsedData = LoginSchema.parse(req.body);
    const user = await User.findOne({ email: parsedData.email });
    if (!user) {
      res.status(400).json({ message: "User not found Please register" });
      return;
    }
    if (user.password !== parsedData.password) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "defaultSecret"
    );
    res.status(200).json({ token: token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};
