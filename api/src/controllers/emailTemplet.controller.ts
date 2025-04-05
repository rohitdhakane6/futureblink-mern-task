import type { Request, Response } from "express";
import EmailTemplate from "../models/emailTemplate.model";
import { z } from "zod";

const CreateEmailTemplateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  subject: z.string().min(1, "Subject is required"),
  body: z.string().min(1, "Body is required"),
});

export const createEmailTemplate = async (req: Request, res: Response) => {
  try {
    const { name, subject, body } = CreateEmailTemplateSchema.parse(req.body);
    const emailTemplate = new EmailTemplate({
      name,
      subject,
      body,
      createdBy: req.userId,
    });
    await emailTemplate.save();
    res.status(201).json(emailTemplate);
  } catch (error) {
    console.error("Error creating email template:", error);
    res.status(500).json({ message: "Error creating email template", error });
  }
};

export const getEmailTemplates = async (req: Request, res: Response) => {
  try {
    const emailTemplates = await EmailTemplate.find({
      createdBy: req.userId,
    })
    res.status(200).json(emailTemplates);
  } catch (error) {
    res.status(500).json({ message: "Error fetching email templates", error });
  }
};

export const getEmailTemplateById = async (req: Request, res: Response) => {
  if (!req.params.id) {
    res.status(400).json({ message: "Email template ID is required" });
    return;
  }
  try {
    const emailTemplate = await EmailTemplate.findOne({
      _id: req.params.id,
      createdBy: req.userId,
    });
    if (!emailTemplate) {
      res.status(404).json({ message: "Email template not found" });
      return;
    }
    res.status(200).json(emailTemplate);
  } catch (error) {
    res.status(500).json({ message: "Error fetching email template", error });
  }
};
