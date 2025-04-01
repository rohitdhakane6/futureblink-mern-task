import type { Request, Response, NextFunction } from "express";

import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      email?: string;
    }
  }
}
const JWT_SECRET = process.env.JWT_SECRET;

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET || "defaultSecret");
    if (typeof decoded !== "string") {
      req.email = decoded.email as string;
      req.userId = decoded.id as string;
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};
