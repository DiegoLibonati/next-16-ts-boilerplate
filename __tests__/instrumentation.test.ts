/**
 * @jest-environment node
 */

import { register } from "@/instrumentation";

import { warnIfDbUnreachable } from "@/server/startup/db_check.startup";

jest.mock("@/server/startup/db_check.startup");

const mockWarnIfDbUnreachable = warnIfDbUnreachable as jest.MockedFunction<
  typeof warnIfDbUnreachable
>;

describe("instrumentation", () => {
  const originalNextRuntime: string | undefined = process.env.NEXT_RUNTIME;

  beforeEach((): void => {
    mockWarnIfDbUnreachable.mockResolvedValue(undefined);
  });

  afterEach((): void => {
    if (originalNextRuntime === undefined) {
      delete process.env.NEXT_RUNTIME;
    } else {
      process.env.NEXT_RUNTIME = originalNextRuntime;
    }
  });

  describe("register", () => {
    it("should run the db reachability check in the nodejs runtime", async () => {
      process.env.NEXT_RUNTIME = "nodejs";

      await register();

      expect(mockWarnIfDbUnreachable).toHaveBeenCalledTimes(1);
    });

    it("should not run the db reachability check in the edge runtime", async () => {
      process.env.NEXT_RUNTIME = "edge";

      await register();

      expect(mockWarnIfDbUnreachable).not.toHaveBeenCalled();
    });

    it("should not run the db reachability check when NEXT_RUNTIME is undefined", async () => {
      delete process.env.NEXT_RUNTIME;

      await register();

      expect(mockWarnIfDbUnreachable).not.toHaveBeenCalled();
    });
  });
});
