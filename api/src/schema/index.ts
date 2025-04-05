import { z } from "zod";

export const emailSenderSchema = z.object({
  email: z.string().email("Invalid email address"),
  smtp: z.object({
    host: z.string().min(1, "SMTP host is required"),
    port: z.number().int().min(1, "Invalid port number"),
    username: z.string().email("Invalid SMTP username"),
    password: z.string().min(1, "Password is required"),
    secure: z.boolean(),
  }),
});

export const EmailTemplateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  subject: z.string().min(1, "Subject is required"),
  body: z.string().min(1, "Body is required"),
});

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const LeadsSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email(),
  company: z.string().optional(),
  phone: z.string().optional().or(z.number()),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional().or(z.number()),
  country: z.string().optional(),
});

export const ListCreatSchema = z.object({
  listName: z.string(),
  leads: z.array(LeadsSchema),
});

const PerformanceSchema = z.object({
  sent: z.number().default(0),
  opened: z.number().default(0),
  clicks: z.number().default(0),
  replies: z.number().default(0),
});
export const SequenceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  status: z.enum(["draft", "published"]).default("draft"),
  performance: PerformanceSchema,
  flowChart: z.object({}).optional(),
});

export const SequenceUpdateSchema = z.object({
  name: z.string().optional(),
  status: z.enum(["draft", "published"]).optional(),
  performance: PerformanceSchema.optional(),
  flowChart: z.any().optional(),
});
