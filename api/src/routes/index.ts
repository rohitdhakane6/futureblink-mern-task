import { Router } from "express";

import listRoutes from "./list.route";
import authRoutes from "./auth.route";
import { authMiddleware } from "../middlewares/auth.middleware";
// import userRoutes from "./user.route";
// import outreachRoutes from "./outreach.route";

const router = Router();


router.use("/list",authMiddleware, listRoutes);
router.use("/auth",authMiddleware, authRoutes);
// router.use("/users", userRoutes);
// router.use("/outreach", outreachRoutes);

export default router;