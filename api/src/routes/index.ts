import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.middleware";

import listRoutes from "./list.route";
import authRoutes from "./auth.route";
import sequenceRoutes from "./sequence.route";
import emailTempletRoutes from "./emailTemplet.route";
import emailSenderRoutes from "./emailSender.routes";

const router = Router();

router.use("/auth", authRoutes);

router.use("/list", authMiddleware, listRoutes);
router.use("/sequence", authMiddleware, sequenceRoutes);
router.use("/email-template", authMiddleware, emailTempletRoutes);
router.use("/email-senders", authMiddleware, emailSenderRoutes);


export default router;
