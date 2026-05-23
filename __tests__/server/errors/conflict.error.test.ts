/**
 * @jest-environment node
 */

import { AppError } from "@/server/errors/app.error";
import { ConflictError } from "@/server/errors/conflict.error";

describe("conflict.error", () => {
  describe("ConflictError", () => {
    it("should extend AppError", () => {
      const error = new ConflictError("CODE", "msg");

      expect(error).toBeInstanceOf(AppError);
    });

    it("should always have status 409", () => {
      const error = new ConflictError("X", "y");

      expect(error.status).toBe(409);
    });

    it("should expose the given code and message", () => {
      const error = new ConflictError("ERR_CONFLICT", "already exists");

      expect(error.code).toBe("ERR_CONFLICT");
      expect(error.message).toBe("already exists");
    });

    it("should use ConflictError as the name", () => {
      const error = new ConflictError("X", "y");

      expect(error.name).toBe("ConflictError");
    });
  });
});
