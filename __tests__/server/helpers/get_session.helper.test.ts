/**
 * @jest-environment node
 */

import { jwtVerify } from "jose";
import { cookies } from "next/headers";

import type { Session } from "@/types/api";

import { getJwtSecret } from "@/server/configs/jwt.config";

import { getSession } from "@/server/helpers/get_session.helper";

const mockGet = jest.fn();
const mockSecret = new Uint8Array([1, 2, 3, 4]);

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

jest.mock("jose", () => ({
  jwtVerify: jest.fn(),
}));

jest.mock("@/server/configs/jwt.config", () => ({
  getJwtSecret: jest.fn(),
}));

describe("get_session.helper", () => {
  describe("getSession", () => {
    beforeEach((): void => {
      (getJwtSecret as jest.Mock).mockReturnValue(mockSecret);
      (cookies as jest.Mock).mockResolvedValue({ get: mockGet });
    });

    describe("when a valid auth-token cookie exists", () => {
      it("should return the session with sub and email", async () => {
        mockGet.mockReturnValue({ value: "valid.jwt.token" });
        (jwtVerify as jest.Mock).mockResolvedValue({
          payload: { sub: "user-123", email: "alice@example.com" },
        });

        const result: Session | null = await getSession();

        expect(result).toEqual({ sub: "user-123", email: "alice@example.com" });
      });

      it("should verify the token using the secret from getJwtSecret", async () => {
        mockGet.mockReturnValue({ value: "valid.jwt.token" });
        (jwtVerify as jest.Mock).mockResolvedValue({
          payload: { sub: "user-123", email: "alice@example.com" },
        });

        await getSession();

        expect(jwtVerify).toHaveBeenCalledWith("valid.jwt.token", mockSecret, {
          algorithms: ["HS256"],
          issuer: "nextjs-app",
          audience: "nextjs-app",
        });
      });

      it("should look up the cookie by auth-token name", async () => {
        mockGet.mockReturnValue({ value: "valid.jwt.token" });
        (jwtVerify as jest.Mock).mockResolvedValue({
          payload: { sub: "user-123", email: "alice@example.com" },
        });

        await getSession();

        expect(mockGet).toHaveBeenCalledWith("auth-token");
      });

      it("should stringify sub and email from the payload", async () => {
        mockGet.mockReturnValue({ value: "valid.jwt.token" });
        (jwtVerify as jest.Mock).mockResolvedValue({
          payload: { sub: 42, email: "x@y.com" },
        });

        const result: Session | null = await getSession();

        expect(result).toEqual({ sub: "42", email: "x@y.com" });
      });
    });

    describe("when the auth-token cookie is missing", () => {
      it("should return null when cookie value is undefined", async () => {
        mockGet.mockReturnValue(undefined);

        const result: Session | null = await getSession();

        expect(result).toBeNull();
      });

      it("should not call jwtVerify when cookie is missing", async () => {
        mockGet.mockReturnValue(undefined);

        await getSession();

        expect(jwtVerify).not.toHaveBeenCalled();
      });
    });

    describe("when the token is invalid", () => {
      it("should return null when jwtVerify throws", async () => {
        mockGet.mockReturnValue({ value: "invalid.token" });
        (jwtVerify as jest.Mock).mockRejectedValue(new Error("invalid signature"));

        const result: Session | null = await getSession();

        expect(result).toBeNull();
      });

      it("should return null when jwtVerify throws JWTExpired", async () => {
        mockGet.mockReturnValue({ value: "expired.token" });
        (jwtVerify as jest.Mock).mockRejectedValue(new Error("JWTExpired"));

        const result: Session | null = await getSession();

        expect(result).toBeNull();
      });
    });
  });
});
