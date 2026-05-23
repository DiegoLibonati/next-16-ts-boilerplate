/**
 * @jest-environment node
 */

import { AppError } from "@/server/errors/app.error";
import { BadRequestError } from "@/server/errors/bad_request.error";

describe("bad_request.error", () => {
  describe("BadRequestError", () => {
    it("should extend AppError", () => {
      const error = new BadRequestError("CODE", "msg");

      expect(error).toBeInstanceOf(AppError);
      expect(error).toBeInstanceOf(Error);
    });

    it("should always have status 400", () => {
      const error = new BadRequestError("X", "y");

      expect(error.status).toBe(400);
    });

    it("should expose the given code and message", () => {
      const error = new BadRequestError("ERR_BAD", "broken input");

      expect(error.code).toBe("ERR_BAD");
      expect(error.message).toBe("broken input");
    });

    it("should use BadRequestError as the name", () => {
      const error = new BadRequestError("X", "y");

      expect(error.name).toBe("BadRequestError");
    });
  });
});
