import type { z } from "zod";

import type { loginBodySchema } from "@/server/schemas/auth.schema";
import type {
  productCreateBodySchema,
  productIdParamsSchema,
} from "@/server/schemas/product.schema";
import type { userCreateBodySchema, userIdParamsSchema } from "@/server/schemas/user.schema";

export type LoginBody = z.infer<typeof loginBodySchema>;

export type UserIdParams = z.infer<typeof userIdParamsSchema>;
export type UserCreateBody = z.infer<typeof userCreateBodySchema>;

export type ProductIdParams = z.infer<typeof productIdParamsSchema>;
export type ProductCreateBody = z.infer<typeof productCreateBodySchema>;
