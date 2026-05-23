/**
 * @jest-environment node
 */

describe("jwt.config", () => {
  const originalEnv: NodeJS.ProcessEnv = process.env;

  beforeEach((): void => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll((): void => {
    process.env = originalEnv;
  });

  describe("getJwtSecret", () => {
    describe("when JWT_SECRET is set", () => {
      it("should return a Uint8Array encoding of the secret", async () => {
        process.env.JWT_SECRET = "my-secret";

        const { getJwtSecret } = await import("@/server/configs/jwt.config");
        const result = getJwtSecret();

        expect(result).toBeInstanceOf(Uint8Array);
        expect(new TextDecoder().decode(result)).toBe("my-secret");
      });

      it("should memoize the secret across calls", async () => {
        process.env.JWT_SECRET = "memoized-secret";

        const { getJwtSecret } = await import("@/server/configs/jwt.config");
        const first = getJwtSecret();
        const second = getJwtSecret();

        expect(first).toBe(second);
      });
    });

    describe("when JWT_SECRET is missing", () => {
      it("should throw a missing env error", async () => {
        delete process.env.JWT_SECRET;

        const { getJwtSecret } = await import("@/server/configs/jwt.config");

        expect(() => getJwtSecret()).toThrow("Missing required environment variable: JWT_SECRET");
      });
    });
  });
});
