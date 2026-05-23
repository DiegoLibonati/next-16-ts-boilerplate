/**
 * @jest-environment node
 */

import mongoose from "mongoose";

import { connectDb } from "@/server/configs/mongo.config";

import { HealthService } from "@/server/services/health.service";

jest.mock("@/server/configs/mongo.config", () => ({
  connectDb: jest.fn(),
}));

describe("health.service", () => {
  describe("checkReadiness", () => {
    describe("when the db connection is healthy", () => {
      it("should return db: true when mongoose readyState is connected", async () => {
        (connectDb as jest.Mock).mockResolvedValue(undefined);
        Object.defineProperty(mongoose.connection, "readyState", {
          configurable: true,
          get: () => mongoose.ConnectionStates.connected,
        });

        const result = await HealthService.checkReadiness();

        expect(result).toEqual({ db: true });
      });
    });

    describe("when mongoose is not connected", () => {
      it("should return db: false when readyState is disconnected", async () => {
        (connectDb as jest.Mock).mockResolvedValue(undefined);
        Object.defineProperty(mongoose.connection, "readyState", {
          configurable: true,
          get: () => mongoose.ConnectionStates.disconnected,
        });

        const result = await HealthService.checkReadiness();

        expect(result).toEqual({ db: false });
      });
    });

    describe("when connectDb throws", () => {
      it("should return db: false on connection error", async () => {
        (connectDb as jest.Mock).mockRejectedValue(new Error("connection refused"));

        const result = await HealthService.checkReadiness();

        expect(result).toEqual({ db: false });
      });
    });
  });
});
