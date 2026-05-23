/**
 * @jest-environment node
 */

import { userCreateBodySchema, userIdParamsSchema } from "@/server/schemas/user.schema";

const validObjectId = "507f1f77bcf86cd799439011";

describe("user.schema", () => {
  describe("userIdParamsSchema", () => {
    it("should accept a valid 24-char hex ObjectId", () => {
      const result = userIdParamsSchema.safeParse({ id: validObjectId });

      expect(result.success).toBe(true);
    });

    it("should reject non-hex characters", () => {
      const result = userIdParamsSchema.safeParse({ id: "not-an-objectid" });

      expect(result.success).toBe(false);
    });

    it("should reject ids of wrong length", () => {
      const result = userIdParamsSchema.safeParse({ id: "507f1f77bcf86cd7994390" });

      expect(result.success).toBe(false);
    });
  });

  describe("userCreateBodySchema", () => {
    describe("when input is valid", () => {
      it("should parse a valid user body", () => {
        const result = userCreateBodySchema.safeParse({
          name: "Alice",
          email: "alice@example.com",
        });

        expect(result.success).toBe(true);
      });

      it("should trim the name", () => {
        const result = userCreateBodySchema.safeParse({
          name: "  Alice  ",
          email: "alice@example.com",
        });

        expect(result.success).toBe(true);
        if (result.success) expect(result.data.name).toBe("Alice");
      });
    });

    describe("when input is invalid", () => {
      it("should reject empty name", () => {
        const result = userCreateBodySchema.safeParse({ name: "", email: "a@b.com" });

        expect(result.success).toBe(false);
      });

      it("should reject name longer than 120 chars", () => {
        const result = userCreateBodySchema.safeParse({
          name: "a".repeat(121),
          email: "a@b.com",
        });

        expect(result.success).toBe(false);
      });

      it("should reject invalid email format", () => {
        const result = userCreateBodySchema.safeParse({ name: "Alice", email: "not-an-email" });

        expect(result.success).toBe(false);
      });

      it("should reject email longer than 254 chars", () => {
        const longEmail = `${"a".repeat(250)}@b.io`;
        const result = userCreateBodySchema.safeParse({ name: "Alice", email: longEmail });

        expect(result.success).toBe(false);
      });
    });
  });
});
