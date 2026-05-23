/**
 * @jest-environment node
 */

import { cookies } from "next/headers";

import type { Session } from "@/types/api";

import { Jwt } from "@/server/configs/jwt.config";

import { getSession } from "@/server/helpers/get_session.helper";

const mockGet = jest.fn();
const mockVerifyJWT = jest.fn();

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

jest.mock("@/server/configs/jwt.config", () => ({
  Jwt: jest.fn(),
}));

describe("get_session.helper", () => {
  describe("getSession", () => {
    beforeEach((): void => {
      (cookies as jest.Mock).mockResolvedValue({ get: mockGet });
      (Jwt as unknown as jest.Mock).mockImplementation(() => ({ verifyJWT: mockVerifyJWT }));
    });

    describe("when a valid auth-token cookie exists", () => {
      it("should return the session with sub and email", async () => {
        mockGet.mockReturnValue({ value: "valid.jwt.token" });
        mockVerifyJWT.mockResolvedValue({
          payload: { sub: "user-123", email: "alice@example.com" },
        });

        const result: Session | null = await getSession();

        expect(result).toEqual({ sub: "user-123", email: "alice@example.com" });
      });

      it("should instantiate Jwt with the cookie token", async () => {
        mockGet.mockReturnValue({ value: "valid.jwt.token" });
        mockVerifyJWT.mockResolvedValue({
          payload: { sub: "user-123", email: "alice@example.com" },
        });

        await getSession();

        expect(Jwt).toHaveBeenCalledWith({ token: "valid.jwt.token" });
      });

      it("should look up the cookie by auth-token name", async () => {
        mockGet.mockReturnValue({ value: "valid.jwt.token" });
        mockVerifyJWT.mockResolvedValue({
          payload: { sub: "user-123", email: "alice@example.com" },
        });

        await getSession();

        expect(mockGet).toHaveBeenCalledWith("auth-token");
      });

      it("should stringify sub and email from the payload", async () => {
        mockGet.mockReturnValue({ value: "valid.jwt.token" });
        mockVerifyJWT.mockResolvedValue({
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

      it("should not call verifyJWT when cookie is missing", async () => {
        mockGet.mockReturnValue(undefined);

        await getSession();

        expect(Jwt).not.toHaveBeenCalled();
        expect(mockVerifyJWT).not.toHaveBeenCalled();
      });
    });

    describe("when the token is invalid", () => {
      it("should return null when verifyJWT returns false", async () => {
        mockGet.mockReturnValue({ value: "invalid.token" });
        mockVerifyJWT.mockResolvedValue(false);

        const result: Session | null = await getSession();

        expect(result).toBeNull();
      });
    });
  });
});
