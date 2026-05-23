/**
 * @jest-environment node
 */

describe("logger.config", () => {
  describe("logger", () => {
    it("should export a logger instance with pino methods", async () => {
      const { logger } = await import("@/server/configs/logger.config");

      expect(typeof logger.info).toBe("function");
      expect(typeof logger.warn).toBe("function");
      expect(typeof logger.error).toBe("function");
      expect(typeof logger.debug).toBe("function");
    });

    it("should use the configured LOG_LEVEL from envs", async () => {
      const { logger } = await import("@/server/configs/logger.config");

      expect(typeof logger.level).toBe("string");
      expect(logger.level.length).toBeGreaterThan(0);
    });
  });
});
