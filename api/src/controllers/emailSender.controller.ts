import type { Request, Response } from "express";
import EmailSender from "../models/emailSender.model";
import { z } from "zod";
import nodemailer from "nodemailer";
import { emailSenderSchema } from "../schema";

/**
 * @desc Get all email senders for a user
 * @route GET /api/v1/email-senders
 */
export const getEmailSenders = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const emailSenders = await EmailSender.find({ user: userId });
    res.status(200).json(emailSenders);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * @desc Add a new email sender with SMTP settings
 * @route POST /api/v1/email-senders
 */
export const addEmailSender = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    // Validate request body
    const validation = emailSenderSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({ error: validation.error.format() });
      return;
    }

    const { email, smtp } = validation.data;

    // Create Nodemailer transporter for testing SMTP credentials
    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      auth: {
        user: smtp.username,
        pass: smtp.password,
      },
    });

    // Verify SMTP credentials
    try {
      await transporter.verify();
    } catch (smtpError) {
      res
        .status(400)
        .json({ error: "Invalid SMTP credentials or connection issue." });
      return;
    }

    // Store the validated SMTP settings in the database
    const newSender = await EmailSender.create({
      user: userId,
      email,
      smtp,
      status: "active",
    });

    res.status(201).json(newSender);
  } catch (error) {
    console.error("Error adding email sender:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * @desc Update an email sender
 * @route PUT /api/email-senders/:id
 */
export const updateEmailSender = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const updateData = req.body;

    const sender = await EmailSender.findOneAndUpdate(
      { _id: id, user: userId },
      updateData,
      {
        new: true,
      }
    );

    if (!sender) {
      res.status(404).json({ error: "Email sender not found" });
      return;
    }

    res.status(200).json(sender);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * @desc Delete an email sender
 * @route DELETE /api/email-senders/:id
 */
export const deleteEmailSender = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const sender = await EmailSender.findOneAndDelete({
      _id: id,
      user: userId,
    });

    if (!sender) {
      res.status(404).json({ error: "Email sender not found" });
      return;
    }

    res.status(200).json({ message: "Email sender deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
