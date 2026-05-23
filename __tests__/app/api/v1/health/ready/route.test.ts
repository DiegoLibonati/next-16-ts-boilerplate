/**
 * @jest-environment node
 */

import { NextResponse } from "next/server";

import { HealthController } from "@/server/controllers/health.controller";

import { GET } from "@/app/api/v1/health/ready/route";

jest.mock("@/server/controllers/health.controller", () => ({
  HealthController: { ready: jest.fn() },
}));

describe("route", () => {
  describe("GET /api/v1/health/ready", () => {
    it("should delegate to HealthController.ready and return the response", async () => {
      const mockResponse = new NextResponse(
        JSON.stringify({ code: "SUCCESS_HEALTH_READY", data: { db: true } }),
        { status: 200 }
      );
      jest.mocked(HealthController.ready).mockResolvedValue(mockResponse);

      const response = await GET();

      expect(HealthController.ready).toHaveBeenCalledTimes(1);
      expect(response).toBe(mockResponse);
    });

    it("should return the controller response status when unhealthy", async () => {
      const mockResponse = new NextResponse(null, { status: 503 });
      jest.mocked(HealthController.ready).mockResolvedValue(mockResponse);

      const response = await GET();

      expect(response.status).toBe(503);
    });
  });
});
