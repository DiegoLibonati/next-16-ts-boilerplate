/**
 * @jest-environment node
 */

import { productCreateBodySchema, productIdParamsSchema } from "@/server/schemas/product.schema";

const validObjectId = "507f1f77bcf86cd799439011";

describe("product.schema", () => {
  describe("productIdParamsSchema", () => {
    it("should accept a valid 24-char hex ObjectId", () => {
      const result = productIdParamsSchema.safeParse({ id: validObjectId });

      expect(result.success).toBe(true);
    });

    it("should reject non-hex characters", () => {
      const result = productIdParamsSchema.safeParse({ id: "xyz" });

      expect(result.success).toBe(false);
    });

    it("should reject ids of wrong length", () => {
      const result = productIdParamsSchema.safeParse({ id: "507f1f77bcf86cd7994390" });

      expect(result.success).toBe(false);
    });
  });

  describe("productCreateBodySchema", () => {
    describe("when input is valid", () => {
      it("should parse a valid product body", () => {
        const result = productCreateBodySchema.safeParse({
          name: "Widget",
          description: "A widget",
          price: 9.99,
        });

        expect(result.success).toBe(true);
      });

      it("should trim name and description", () => {
        const result = productCreateBodySchema.safeParse({
          name: "  Widget  ",
          description: "  A widget  ",
          price: 9.99,
        });

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.name).toBe("Widget");
          expect(result.data.description).toBe("A widget");
        }
      });

      it("should accept price of 0", () => {
        const result = productCreateBodySchema.safeParse({
          name: "Free",
          description: "Free thing",
          price: 0,
        });

        expect(result.success).toBe(true);
      });
    });

    describe("when input is invalid", () => {
      it("should reject negative price", () => {
        const result = productCreateBodySchema.safeParse({
          name: "Widget",
          description: "A widget",
          price: -1,
        });

        expect(result.success).toBe(false);
      });

      it("should reject empty name", () => {
        const result = productCreateBodySchema.safeParse({
          name: "",
          description: "A widget",
          price: 1,
        });

        expect(result.success).toBe(false);
      });

      it("should reject name longer than 200 chars", () => {
        const result = productCreateBodySchema.safeParse({
          name: "a".repeat(201),
          description: "desc",
          price: 1,
        });

        expect(result.success).toBe(false);
      });

      it("should reject description longer than 2000 chars", () => {
        const result = productCreateBodySchema.safeParse({
          name: "Widget",
          description: "a".repeat(2001),
          price: 1,
        });

        expect(result.success).toBe(false);
      });
    });
  });
});
