import type { NextRequest } from "next/server";

import { ProductController } from "@/server/controllers/product.controller";

export async function GET(
  req: NextRequest,
  ctx: {
    params: Promise<{ id: string }>;
  }
): Promise<Response> {
  return ProductController.getById(req, await ctx.params);
}
