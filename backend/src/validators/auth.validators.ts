import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .email("Invalid Email address")
  .max(255);
export const passwordSchema = z.string().trim().min(4).max(12);

export const registerSchema = z
  .object({
    name: z.string().trim().min(3).max(55),
    password: passwordSchema,
    email: emailSchema,
  })
  .strict();
export const loginSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
  })
  .strict();

export type RegisterSchemaType = z.infer<typeof registerSchema>;
export type LoginSchemaType = z.infer<typeof loginSchema>;
