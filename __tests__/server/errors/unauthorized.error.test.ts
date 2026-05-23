/**
 * @jest-environment node
 */

import { AppError } from "@/server/errors/app.error";
import { UnauthorizedError } from "@/server/errors/unauthorized.error";

describe("unauthorized.error", () => {
  describe("UnauthorizedError", () => {
    it("should extend AppError", () => {
      const error = new UnauthorizedError("CODE", "msg");

      expect(error).toBeInstanceOf(AppError);
    });

    it("should always have status 401", () => {
      const error = new UnauthorizedError("X", "y");

      expect(error.status).toBe(401);
    });

    it("should expose the given code and message", () => {
      const error = new UnauthorizedError("ERR_UNAUTH", "no token");

      expect(error.code).toBe("ERR_UNAUTH");
      expect(error.message).toBe("no token");
    });

    it("should use UnauthorizedError as the name", () => {
      const error = new UnauthorizedError("X", "y");

      expect(error.name).toBe("UnauthorizedError");
    });
  });
});
