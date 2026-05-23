import { z } from "zod";

export const productIdParamsSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Must be a valid ObjectId"),
});

export const productCreateBodySchema = z.object({
  name: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(2000),
  price: z.number().nonnegative(),
});
