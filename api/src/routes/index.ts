import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.middleware";

import listRoutes from "./list.route";
import authRoutes from "./auth.route";
import sequenceRoutes from "./sequence.route";
import emailTempletRoutes from "./emailTemplet.route";
import emailSenderRoutes from "./emailSender.routes";
// import userRoutes from "./user.route";
// import outreachRoutes from "./outreach.route";

const router = Router();


router.use("/list",authMiddleware, listRoutes);
router.use("/auth",authMiddleware, authRoutes);
router.use("/sequence",authMiddleware, sequenceRoutes);
router.use("/email-template",authMiddleware, emailTempletRoutes);
router.use("/email-senders",authMiddleware, emailSenderRoutes);

// router.use("/users", userRoutes);
// router.use("/outreach", outreachRoutes);

export default router;