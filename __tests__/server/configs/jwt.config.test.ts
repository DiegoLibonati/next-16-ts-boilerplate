/**
 * @jest-environment node
 */

import type { Jwt as JwtClass } from "@/server/configs/jwt.config";

jest.mock("jose", () => ({
  SignJWT: jest.fn(),
  jwtVerify: jest.fn(),
}));

describe("jwt.config", () => {
  const originalEnv: NodeJS.ProcessEnv = process.env;

  afterAll((): void => {
    process.env = originalEnv;
  });

  describe("Jwt", () => {
    interface MockedJose {
      SignJWT: jest.Mock;
      jwtVerify: jest.Mock;
    }

    interface SignChain {
      setProtectedHeader: jest.Mock;
      setIssuedAt: jest.Mock;
      setIssuer: jest.Mock;
      setAudience: jest.Mock;
      setExpirationTime: jest.Mock;
      sign: jest.Mock;
    }

    const SECRET_VALUE = "jwt-class-secret";

    let jose: MockedJose;
    let Jwt: typeof JwtClass;

    beforeAll(async (): Promise<void> => {
      process.env.JWT_SECRET = SECRET_VALUE;
      jose = (await import("jose")) as unknown as MockedJose;
      ({ Jwt } = await import("@/server/configs/jwt.config"));
    });

    const buildSignChain = (signResult = "signed.token"): SignChain => ({
      setProtectedHeader: jest.fn().mockReturnThis(),
      setIssuedAt: jest.fn().mockReturnThis(),
      setIssuer: jest.fn().mockReturnThis(),
      setAudience: jest.fn().mockReturnThis(),
      setExpirationTime: jest.fn().mockReturnThis(),
      sign: jest.fn().mockResolvedValue(signResult),
    });

    describe("signJWT", () => {
      it("should sign with HS256, issuer, audience and expiration", async () => {
        const chain = buildSignChain("signed.token");
        jose.SignJWT.mockImplementation(() => chain);

        const payload = { sub: "user-1", email: "a@b.com" };
        const token = await new Jwt({ payload }).signJWT();

        expect(jose.SignJWT).toHaveBeenCalledWith(payload);
        expect(chain.setProtectedHeader).toHaveBeenCalledWith({ alg: "HS256" });
        expect(chain.setIssuer).toHaveBeenCalledWith("nextjs-app");
        expect(chain.setAudience).toHaveBeenCalledWith("nextjs-app");
        expect(chain.setExpirationTime).toHaveBeenCalledWith("7d");
        expect(token).toBe("signed.token");
      });

      it("should sign using the encoded JWT_SECRET", async () => {
        const chain = buildSignChain();
        jose.SignJWT.mockImplementation(() => chain);

        await new Jwt({ payload: {} }).signJWT();

        const expectedSecret = new TextEncoder().encode(SECRET_VALUE);
        expect(chain.sign).toHaveBeenCalledWith(expectedSecret);
      });

      it("should default payload to empty object when config is missing", async () => {
        const chain = buildSignChain();
        jose.SignJWT.mockImplementation(() => chain);

        await new Jwt().signJWT();

        expect(jose.SignJWT).toHaveBeenCalledWith({});
      });
    });

    describe("verifyJWT", () => {
      it("should verify token with HS256, issuer and audience", async () => {
        jose.jwtVerify.mockResolvedValue({ payload: { sub: "u1" } });

        const result = await new Jwt({ token: "good.token" }).verifyJWT();

        const expectedSecret = new TextEncoder().encode(SECRET_VALUE);
        expect(jose.jwtVerify).toHaveBeenCalledWith("good.token", expectedSecret, {
          algorithms: ["HS256"],
          issuer: "nextjs-app",
          audience: "nextjs-app",
        });
        expect(result).toEqual({ payload: { sub: "u1" } });
      });

      it("should return false when token is missing", async () => {
        const result = await new Jwt().verifyJWT();

        expect(result).toBe(false);
        expect(jose.jwtVerify).not.toHaveBeenCalled();
      });

      it("should return false when token is empty string", async () => {
        const result = await new Jwt({ token: "" }).verifyJWT();

        expect(result).toBe(false);
        expect(jose.jwtVerify).not.toHaveBeenCalled();
      });

      it("should return false when jwtVerify throws", async () => {
        jose.jwtVerify.mockRejectedValue(new Error("invalid signature"));

        const result = await new Jwt({ token: "bad.token" }).verifyJWT();

        expect(result).toBe(false);
      });
    });
  });
});
