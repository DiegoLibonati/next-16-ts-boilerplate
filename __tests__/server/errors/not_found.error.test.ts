/**
 * @jest-environment node
 */

import { AppError } from "@/server/errors/app.error";
import { NotFoundError } from "@/server/errors/not_found.error";

describe("not_found.error", () => {
  describe("NotFoundError", () => {
    it("should extend AppError", () => {
      const error = new NotFoundError();

      expect(error).toBeInstanceOf(AppError);
    });

    it("should always have status 404", () => {
      const error = new NotFoundError();

      expect(error.status).toBe(404);
    });

    it("should default to NOT_FOUND_ROUTE code and message", () => {
      const error = new NotFoundError();

      expect(error.code).toBe("NOT_FOUND_ROUTE");
      expect(error.message).toBe("Route not found.");
    });

    it("should allow overriding code and message", () => {
      const error = new NotFoundError("NOT_FOUND_USER", "User not found.");

      expect(error.code).toBe("NOT_FOUND_USER");
      expect(error.message).toBe("User not found.");
    });

    it("should use NotFoundError as the name", () => {
      const error = new NotFoundError();

      expect(error.name).toBe("NotFoundError");
    });
  });
});
