/**
 * @jest-environment node
 */

import type { Envs } from "@/types/api";

import { getEnvs } from "@/server/configs/env.config";
import { logger } from "@/server/configs/logger.config";

import { warnIfDbUnreachable } from "@/server/startup/db_check.startup";

import { mockEnvs } from "@tests/__mocks__/envs.mock";

jest.mock("@/server/configs/env.config");
jest.mock("@/server/configs/logger.config", () => ({
  logger: { warn: jest.fn() },
}));

const mockGetEnvs = getEnvs as jest.MockedFunction<typeof getEnvs>;
const mockLoggerWarn = logger.warn as unknown as jest.Mock;

const UNREACHABLE_PORT = 27099;

const buildEnvs = (databaseUrl: string): Envs => ({
  PORT: 5050,
  ENV: "test",
  JWT_SECRET: mockEnvs.JWT_SECRET,
  DATABASE_URL: databaseUrl,
  LOG_LEVEL: "silent",
  RATE_LIMIT_WINDOW_MS: 900000,
  RATE_LIMIT_MAX: 0,
  BODY_LIMIT: "1gb",
  SEED_DEFAULT_DATA: false,
});

describe("db_check.startup", () => {
  describe("warnIfDbUnreachable", () => {
    it("should not log a warning when the database port is reachable", async () => {
      const databaseUrl = `mongodb://${mockEnvs.MONGO_USER}:${mockEnvs.MONGO_PASS}@${mockEnvs.MONGO_HOST}:${mockEnvs.MONGO_PORT}/${mockEnvs.MONGO_DB_NAME}?authSource=${mockEnvs.MONGO_AUTH_SOURCE}`;
      mockGetEnvs.mockReturnValue(buildEnvs(databaseUrl));

      await warnIfDbUnreachable();

      expect(mockLoggerWarn).not.toHaveBeenCalled();
    });

    it("should log a warning with the host and port when the database is not reachable", async () => {
      const databaseUrl = `mongodb://user:pass@localhost:${String(UNREACHABLE_PORT)}/some_db`;
      mockGetEnvs.mockReturnValue(buildEnvs(databaseUrl));

      await warnIfDbUnreachable();

      expect(mockLoggerWarn).toHaveBeenCalledTimes(1);
      expect(mockLoggerWarn).toHaveBeenCalledWith(
        expect.stringContaining(`localhost:${String(UNREACHABLE_PORT)}`)
      );
    });

    it("should resolve without logging when getEnvs throws", async () => {
      mockGetEnvs.mockImplementation((): never => {
        throw new Error("Invalid environment variables");
      });

      await expect(warnIfDbUnreachable()).resolves.toBeUndefined();

      expect(mockLoggerWarn).not.toHaveBeenCalled();
    });

    it("should resolve without logging when DATABASE_URL is malformed", async () => {
      mockGetEnvs.mockReturnValue(buildEnvs("not-a-valid-url"));

      await expect(warnIfDbUnreachable()).resolves.toBeUndefined();

      expect(mockLoggerWarn).not.toHaveBeenCalled();
    });
  });
});
