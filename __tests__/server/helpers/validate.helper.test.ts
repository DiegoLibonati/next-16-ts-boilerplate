/**
 * @jest-environment node
 */

import { NextRequest } from "next/server";
import { z } from "zod";

import { BadRequestError } from "@/server/errors/bad_request.error";

import { validateBody, validateParams, validateQuery } from "@/server/helpers/validate.helper";

const buildJsonRequest = (body: unknown): NextRequest =>
  new NextRequest("http://localhost/api/test", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

const buildBrokenJsonRequest = (): NextRequest =>
  new NextRequest("http://localhost/api/test", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{not json",
  });

const buildQueryRequest = (search: string): NextRequest =>
  new NextRequest(`http://localhost/api/test?${search}`);

describe("validate.helper", () => {
  describe("validateBody", () => {
    const schema = z.object({ email: z.email(), age: z.number().int().positive() });

    describe("when the body is valid", () => {
      it("should return the parsed body", async () => {
        const req = buildJsonRequest({ email: "a@b.com", age: 30 });

        const result = await validateBody(req, schema);

        expect(result).toEqual({ email: "a@b.com", age: 30 });
      });
    });

    describe("when the body is invalid", () => {
      it("should throw BadRequestError for invalid field", async () => {
        const req = buildJsonRequest({ email: "not-an-email", age: 30 });

        await expect(validateBody(req, schema)).rejects.toThrow(BadRequestError);
      });

      it("should include the field path in the error message", async () => {
        const req = buildJsonRequest({ email: "not-an-email", age: 30 });

        await expect(validateBody(req, schema)).rejects.toThrow(/email/);
      });

      it("should throw BadRequestError for missing required field", async () => {
        const req = buildJsonRequest({ email: "a@b.com" });

        await expect(validateBody(req, schema)).rejects.toThrow(BadRequestError);
      });
    });

    describe("when the body is not valid JSON", () => {
      it("should throw BadRequestError for malformed body", async () => {
        const req = buildBrokenJsonRequest();

        await expect(validateBody(req, schema)).rejects.toThrow("Malformed JSON body");
      });
    });
  });

  describe("validateParams", () => {
    const schema = z.object({ id: z.string().min(3) });

    describe("when params are valid", () => {
      it("should return the parsed params", () => {
        const result = validateParams({ id: "abc" }, schema);

        expect(result).toEqual({ id: "abc" });
      });
    });

    describe("when params are invalid", () => {
      it("should throw BadRequestError", () => {
        expect(() => validateParams({ id: "x" }, schema)).toThrow(BadRequestError);
      });

      it("should throw BadRequestError with ERROR_VALIDATION code", () => {
        try {
          validateParams({ id: "x" }, schema);
          throw new Error("should have thrown");
        } catch (e) {
          expect(e).toBeInstanceOf(BadRequestError);
          expect((e as BadRequestError).code).toBe("ERROR_VALIDATION");
        }
      });
    });
  });

  describe("validateQuery", () => {
    const schema = z.object({ page: z.coerce.number().int().positive() });

    describe("when query params are valid", () => {
      it("should return the parsed query", () => {
        const req = buildQueryRequest("page=3");

        const result = validateQuery(req, schema);

        expect(result).toEqual({ page: 3 });
      });
    });

    describe("when query params are invalid", () => {
      it("should throw BadRequestError when value cannot be coerced", () => {
        const req = buildQueryRequest("page=abc");

        expect(() => validateQuery(req, schema)).toThrow(BadRequestError);
      });
    });
  });
});
