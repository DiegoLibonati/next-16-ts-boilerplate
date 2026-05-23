import { z } from "zod";

export const userIdParamsSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Must be a valid ObjectId"),
});

export const userCreateBodySchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.email().max(254),
});
