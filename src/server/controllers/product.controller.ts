import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

import { ProductService } from "@/server/services/product.service";

import { productIdParamsSchema } from "@/server/schemas/product.schema";

import { NotFoundError } from "@/server/errors/not_found.error";

import { validateParams } from "@/server/helpers/validate.helper";
import { withErrorHandler } from "@/server/helpers/with_error_handler.helper";

import { CODES_NOT, CODES_SUCCESS } from "@/server/constants/codes.constant";
import { MESSAGES_NOT, MESSAGES_SUCCESS } from "@/server/constants/messages.constant";

export const ProductController = {
  getAll: withErrorHandler(
    "ProductController.getAll",
    async (_req: NextRequest): Promise<NextResponse> => {
      const products = await ProductService.getAllProducts();
      return NextResponse.json(
        {
          code: CODES_SUCCESS.getAllProducts,
          message: MESSAGES_SUCCESS.getAllProducts,
          data: products,
        },
        { status: 200 }
      );
    }
  ),

  getById: withErrorHandler(
    "ProductController.getById",
    async (_req: NextRequest, rawParams: unknown): Promise<NextResponse> => {
      const { id } = validateParams(rawParams, productIdParamsSchema);

      const product = await ProductService.getProductById(id);
      if (!product) throw new NotFoundError(CODES_NOT.foundProduct, MESSAGES_NOT.foundProduct);

      return NextResponse.json(
        {
          code: CODES_SUCCESS.getProduct,
          message: MESSAGES_SUCCESS.getProduct,
          data: product,
        },
        { status: 200 }
      );
    }
  ),
};
