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
