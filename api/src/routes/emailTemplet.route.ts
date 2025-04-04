import { Router } from "express";
import {
  createEmailTemplate,
  getEmailTemplates,
  getEmailTemplateById,
} from "../controllers/emailTemplet.controller";

const router = Router();
router.post("/", createEmailTemplate);
router.get("/", getEmailTemplates);
router.get("/:id", getEmailTemplateById);

export default router;
