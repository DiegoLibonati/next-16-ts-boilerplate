/**
 * @jest-environment node
 */

import { NextResponse } from "next/server";

import { BadRequestError } from "@/server/errors/bad_request.error";
import { NotFoundError } from "@/server/errors/not_found.error";

import { withErrorHandler } from "@/server/helpers/with_error_handler.helper";

const mockLoggerError = jest.fn();
const mockLoggerWarn = jest.fn();

jest.mock("@/server/configs/logger.config", () => ({
  logger: {
    error: (...args: unknown[]): void => {
      mockLoggerError(...args);
    },
    warn: (...args: unknown[]): void => {
      mockLoggerWarn(...args);
    },
    info: jest.fn(),
    debug: jest.fn(),
  },
}));

describe("with_error_handler.helper", () => {
  describe("withErrorHandler", () => {
    describe("when the wrapped function succeeds", () => {
      it("should return the function's response unchanged", async () => {
        const expected = NextResponse.json({ ok: true }, { status: 200 });
        const wrapped = withErrorHandler("ctx", () => Promise.resolve(expected));

        const result = await wrapped();

        expect(result).toBe(expected);
      });
    });

    describe("when the wrapped function throws an AppError", () => {
      it("should return a response with the error status and code", async () => {
        const wrapped = withErrorHandler("ctx", (): Promise<NextResponse> => {
          return Promise.reject(new NotFoundError("NOT_FOUND_USER", "User not found."));
        });

        const response = await wrapped();
        const body: { code: string; message: string } = await response.json();

        expect(response.status).toBe(404);
        expect(body.code).toBe("NOT_FOUND_USER");
        expect(body.message).toBe("User not found.");
      });

      it("should return 400 for BadRequestError", async () => {
        const wrapped = withErrorHandler("ctx", (): Promise<NextResponse> => {
          return Promise.reject(new BadRequestError("ERROR_VALIDATION", "bad input"));
        });

        const response = await wrapped();

        expect(response.status).toBe(400);
      });

      it("should not log AppErrors (status < 500)", async () => {
        const wrapped = withErrorHandler("ctx", (): Promise<NextResponse> => {
          return Promise.reject(new BadRequestError("ERR", "msg"));
        });

        await wrapped();

        expect(mockLoggerError).not.toHaveBeenCalled();
      });
    });

    describe("when the wrapped function throws an unexpected error", () => {
      it("should return 500 with ERROR_GENERIC code", async () => {
        const wrapped = withErrorHandler("ctx", (): Promise<NextResponse> => {
          return Promise.reject(new Error("DB exploded"));
        });

        const response = await wrapped();
        const body: { code: string } = await response.json();

        expect(response.status).toBe(500);
        expect(body.code).toBe("ERROR_GENERIC");
      });

      it("should log the error via the logger", async () => {
        const wrapped = withErrorHandler("ctx", (): Promise<NextResponse> => {
          return Promise.reject(new Error("DB exploded"));
        });

        await wrapped();

        expect(mockLoggerError).toHaveBeenCalledTimes(1);
      });
    });

    describe("argument forwarding", () => {
      it("should forward arguments to the wrapped function", async () => {
        const mockFn = jest.fn((_a: number, _b: string): Promise<NextResponse> => {
          return Promise.resolve(NextResponse.json({}));
        });
        const wrapped = withErrorHandler("ctx", mockFn);

        await wrapped(42, "hello");

        expect(mockFn).toHaveBeenCalledWith(42, "hello");
      });
    });
  });
});
