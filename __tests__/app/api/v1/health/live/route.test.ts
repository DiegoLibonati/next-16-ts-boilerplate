/**
 * @jest-environment node
 */

import { NextResponse } from "next/server";

import { HealthController } from "@/server/controllers/health.controller";

import { GET } from "@/app/api/v1/health/live/route";

jest.mock("@/server/controllers/health.controller", () => ({
  HealthController: { live: jest.fn() },
}));

describe("route", () => {
  describe("GET /api/v1/health/live", () => {
    it("should delegate to HealthController.live and return the response", () => {
      const mockResponse = new NextResponse(JSON.stringify({ code: "SUCCESS_HEALTH_LIVE" }), {
        status: 200,
      });
      jest.mocked(HealthController.live).mockReturnValue(mockResponse);

      const response = GET();

      expect(HealthController.live).toHaveBeenCalledTimes(1);
      expect(response).toBe(mockResponse);
    });

    it("should return the controller response status", () => {
      const mockResponse = new NextResponse(null, { status: 200 });
      jest.mocked(HealthController.live).mockReturnValue(mockResponse);

      const response = GET();

      expect(response.status).toBe(200);
    });
  });
});
