import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import EmailSender from "../models/emailSender.model";

const transporterCache = new Map<string, Transporter>();

export const getOrCreateTransporter = async (userId: string): Promise<Transporter> => {
  if (transporterCache.has(userId)) {
    return transporterCache.get(userId)!;
  }

  const config = await EmailSender.findOne({ user: userId });
  if (!config) throw new Error("SMTP config not found");

  const transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.secure,
    auth: {
      user: config.smtp.username,
      pass: config.smtp.password,
    },
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
    rateLimit: 5,
  });

  transporterCache.set(userId, transporter);
  return transporter;
};
