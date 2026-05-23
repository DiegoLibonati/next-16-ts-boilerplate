/**
 * @jest-environment node
 */

import { AppError } from "@/server/errors/app.error";

describe("app.error", () => {
  describe("AppError", () => {
    it("should be an instance of Error", () => {
      const error = new AppError(500, "CODE", "boom");

      expect(error).toBeInstanceOf(Error);
    });

    it("should expose status, code, and message", () => {
      const error = new AppError(418, "TEAPOT", "i am a teapot");

      expect(error.status).toBe(418);
      expect(error.code).toBe("TEAPOT");
      expect(error.message).toBe("i am a teapot");
    });

    it("should use the constructor name as the error name", () => {
      const error = new AppError(500, "X", "y");

      expect(error.name).toBe("AppError");
    });

    it("should be throwable and catchable", () => {
      expect(() => {
        throw new AppError(400, "BAD", "bad");
      }).toThrow(AppError);
    });
  });
});
