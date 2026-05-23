/**
 * @jest-environment node
 */

import { HealthController } from "@/server/controllers/health.controller";

import { HealthService } from "@/server/services/health.service";

jest.mock("@/server/services/health.service", () => ({
  HealthService: { checkReadiness: jest.fn() },
}));

jest.mock("@/server/configs/logger.config", () => ({
  logger: { warn: jest.fn(), error: jest.fn(), info: jest.fn(), debug: jest.fn() },
}));

describe("health.controller", () => {
  describe("live", () => {
    it("should return 200 with SUCCESS_HEALTH_LIVE code", async () => {
      const response = HealthController.live();
      const body: { code: string; message: string } = await response.json();

      expect(response.status).toBe(200);
      expect(body.code).toBe("SUCCESS_HEALTH_LIVE");
      expect(body.message).toBe("Service is alive.");
    });
  });

  describe("ready", () => {
    describe("when the db is connected", () => {
      it("should return 200 with SUCCESS_HEALTH_READY code", async () => {
        (HealthService.checkReadiness as jest.Mock).mockResolvedValue({ db: true });

        const response = await HealthController.ready();
        const body: { code: string; data: { db: boolean } } = await response.json();

        expect(response.status).toBe(200);
        expect(body.code).toBe("SUCCESS_HEALTH_READY");
        expect(body.data).toEqual({ db: true });
      });
    });

    describe("when the db is not connected", () => {
      it("should return 503 with ERROR_GENERIC code", async () => {
        (HealthService.checkReadiness as jest.Mock).mockResolvedValue({ db: false });

        const response = await HealthController.ready();
        const body: { code: string; data: { db: boolean } } = await response.json();

        expect(response.status).toBe(503);
        expect(body.code).toBe("ERROR_GENERIC");
        expect(body.data).toEqual({ db: false });
      });
    });
  });
});
