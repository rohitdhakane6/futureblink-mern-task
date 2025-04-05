import type { Request, Response } from "express";
import EmailTemplate from "../models/emailTemplate.model";
import { EmailTemplateSchema } from "../schema";

/**
 * @desc Create a new email template
 * @route POST /api/v1/email-templates
 */

export const createEmailTemplate = async (req: Request, res: Response) => {
  try {
    const { name, subject, body } = EmailTemplateSchema.parse(req.body);
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

/**
 * @desc Get all email templates
 * @route GET /api/v1/email-templates
 */
export const getEmailTemplates = async (req: Request, res: Response) => {
  try {
    const emailTemplates = await EmailTemplate.find({
      createdBy: req.userId,
    });
    res.status(200).json(emailTemplates);
  } catch (error) {
    res.status(500).json({ message: "Error fetching email templates", error });
  }
};

/**
 * @desc Get a single email template by ID
 * @route GET /api/v1/email-templates/:id
 */
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

/**
 * @desc Delete an email template
 * @route DELETE /api/v1/email-templates/:id
 */
export const updateEmailTemplate = async (req: Request, res: Response) => {
  if (!req.params.id) {
    res.status(400).json({ message: "Email template ID is required" });
    return;
  }
  try {
    const { name, subject, body } = EmailTemplateSchema.parse(req.body);
    const emailTemplate = await EmailTemplate.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.userId },
      { name, subject, body },
      { new: true }
    );
    if (!emailTemplate) {
      res.status(404).json({ message: "Email template not found" });
      return;
    }
    res.status(200).json(emailTemplate);
  } catch (error) {
    res.status(500).json({ message: "Error updating email template", error });
  }
};
