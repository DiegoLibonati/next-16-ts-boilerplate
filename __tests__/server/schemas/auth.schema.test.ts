/**
 * @jest-environment node
 */

import { loginBodySchema } from "@/server/schemas/auth.schema";

describe("auth.schema", () => {
  describe("loginBodySchema", () => {
    describe("when input is valid", () => {
      it("should parse a valid email and password", () => {
        const result = loginBodySchema.safeParse({
          email: "alice@example.com",
          password: "secret123",
        });

        expect(result.success).toBe(true);
      });
    });

    describe("email validation", () => {
      it("should reject when email is not a valid email", () => {
        const result = loginBodySchema.safeParse({ email: "not-an-email", password: "secret123" });

        expect(result.success).toBe(false);
      });

      it("should reject when email exceeds 254 chars", () => {
        const longEmail = `${"a".repeat(250)}@b.io`;
        const result = loginBodySchema.safeParse({ email: longEmail, password: "secret123" });

        expect(result.success).toBe(false);
      });
    });

    describe("password validation", () => {
      it("should reject when password is shorter than 8 chars", () => {
        const result = loginBodySchema.safeParse({ email: "a@b.com", password: "short" });

        expect(result.success).toBe(false);
      });

      it("should reject when password exceeds 128 chars", () => {
        const result = loginBodySchema.safeParse({
          email: "a@b.com",
          password: "a".repeat(129),
        });

        expect(result.success).toBe(false);
      });

      it("should accept password of exactly 8 chars", () => {
        const result = loginBodySchema.safeParse({ email: "a@b.com", password: "12345678" });

        expect(result.success).toBe(true);
      });
    });

    describe("missing fields", () => {
      it("should reject when email is missing", () => {
        const result = loginBodySchema.safeParse({ password: "secret123" });

        expect(result.success).toBe(false);
      });

      it("should reject when password is missing", () => {
        const result = loginBodySchema.safeParse({ email: "a@b.com" });

        expect(result.success).toBe(false);
      });
    });
  });
});
