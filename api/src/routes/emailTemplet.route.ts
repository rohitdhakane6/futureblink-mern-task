import { Router } from "express";
import {
  createEmailTemplate,
  getEmailTemplates,
  getEmailTemplateById,
  updateEmailTemplate,
} from "../controllers/emailTemplet.controller";

const router = Router();
router.post("/", createEmailTemplate);
router.get("/", getEmailTemplates);
router.get("/:id", getEmailTemplateById);
router.put("/:id", updateEmailTemplate);

export default router;
