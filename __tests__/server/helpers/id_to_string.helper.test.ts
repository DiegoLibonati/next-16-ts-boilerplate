/**
 * @jest-environment node
 */

import mongoose from "mongoose";

import { idToString } from "@/server/helpers/id_to_string.helper";

describe("id_to_string.helper", () => {
  describe("idToString", () => {
    describe("when given a mongoose ObjectId", () => {
      it("should return its hex string representation", () => {
        const id = new mongoose.Types.ObjectId();

        const result = idToString(id);

        expect(result).toBe(id.toHexString());
      });

      it("should return a 24-character hex string", () => {
        const id = new mongoose.Types.ObjectId();

        const result = idToString(id);

        expect(result).toHaveLength(24);
        expect(result).toMatch(/^[0-9a-f]{24}$/);
      });
    });

    describe("when given a string", () => {
      it("should return the string unchanged", () => {
        expect(idToString("some-id")).toBe("some-id");
      });
    });

    describe("when given a number", () => {
      it("should return the stringified number", () => {
        expect(idToString(42)).toBe("42");
      });
    });

    describe("when given null or undefined", () => {
      it("should return 'null' for null", () => {
        expect(idToString(null)).toBe("null");
      });

      it("should return 'undefined' for undefined", () => {
        expect(idToString(undefined)).toBe("undefined");
      });
    });
  });
});
