import express from "express";
import {
  getEmailSenders,
  addEmailSender,
  updateEmailSender,
  deleteEmailSender,
} from "../controllers/emailSender.controller";

const router = express.Router();

// Apply authentication middleware to protect routes
router.get("/", getEmailSenders);
router.post("/", addEmailSender);
router.put("/:id", updateEmailSender);
router.delete("/:id", deleteEmailSender);

export default router;
