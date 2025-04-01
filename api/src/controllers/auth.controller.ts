import type { Request, Response } from "express";
import z from "zod";
import jwt from "jsonwebtoken";
import User from "../models/user.model";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Todo: add password hashing and

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
    res.status(200).json({ "token": token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};
