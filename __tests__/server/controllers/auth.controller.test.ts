/**
 * @jest-environment node
 */

import { NextRequest } from "next/server";

import { getEnvs } from "@/server/configs/env.config";

import { AuthController } from "@/server/controllers/auth.controller";

import { AuthService } from "@/server/services/auth.service";

jest.mock("@/server/services/auth.service", () => ({
  AuthService: { login: jest.fn() },
}));

jest.mock("@/server/configs/env.config", () => ({
  getEnvs: jest.fn(() => ({ ENV: "test", LOG_LEVEL: "silent" })),
}));

jest.mock("@/server/configs/logger.config", () => ({
  logger: { error: jest.fn(), warn: jest.fn(), info: jest.fn(), debug: jest.fn() },
}));

const buildLoginRequest = (body?: unknown): NextRequest =>
  new NextRequest("http://localhost/api/v1/auth/login", {
    method: "POST",
    body: body !== undefined ? JSON.stringify(body) : null,
    headers: { "Content-Type": "application/json" },
  });

describe("auth.controller", () => {
  describe("login", () => {
    beforeEach((): void => {
      (getEnvs as jest.Mock).mockReturnValue({ ENV: "test" });
    });

    describe("when credentials are valid", () => {
      it("should return 200 with success code", async () => {
        (AuthService.login as jest.Mock).mockResolvedValue("jwt.token.string");
        const req = buildLoginRequest({ email: "alice@example.com", password: "pass1234" });

        const response = await AuthController.login(req);
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body.code).toBe("SUCCESS_LOGIN");
      });

      it("should set the auth-token cookie on successful login", async () => {
        (AuthService.login as jest.Mock).mockResolvedValue("jwt.token.string");
        const req = buildLoginRequest({ email: "alice@example.com", password: "pass1234" });

        const response = await AuthController.login(req);
        const setCookie = response.headers.get("set-cookie");

        expect(setCookie).toContain("auth-token");
      });

      it("should pass email and password to AuthService.login", async () => {
        (AuthService.login as jest.Mock).mockResolvedValue("jwt.token.string");
        const req = buildLoginRequest({ email: "alice@example.com", password: "pass1234" });

        await AuthController.login(req);

        expect(AuthService.login).toHaveBeenCalledWith("alice@example.com", "pass1234");
      });
    });

    describe("when email or password is missing", () => {
      it("should return 400 when email is missing", async () => {
        const req = buildLoginRequest({ password: "pass1234" });

        const response = await AuthController.login(req);

        expect(response.status).toBe(400);
        expect(AuthService.login).not.toHaveBeenCalled();
      });

      it("should return 400 when password is missing", async () => {
        const req = buildLoginRequest({ email: "alice@example.com" });

        const response = await AuthController.login(req);

        expect(response.status).toBe(400);
        expect(AuthService.login).not.toHaveBeenCalled();
      });

      it("should return 400 when body is empty", async () => {
        const req = buildLoginRequest({});

        const response = await AuthController.login(req);

        expect(response.status).toBe(400);
      });
    });

    describe("when credentials are invalid", () => {
      it("should return 401 when AuthService returns null", async () => {
        (AuthService.login as jest.Mock).mockResolvedValue(null);
        const req = buildLoginRequest({ email: "alice@example.com", password: "wrongpass1" });

        const response = await AuthController.login(req);
        const body = await response.json();

        expect(response.status).toBe(401);
        expect(body.code).toBe("ERROR_INVALID_CREDENTIALS");
      });
    });

    describe("when an unexpected error occurs", () => {
      beforeEach(() => {
        jest.spyOn(console, "error").mockImplementation(() => {
          // Empty fn
        });
      });

      it("should return 500 with generic error code", async () => {
        (AuthService.login as jest.Mock).mockRejectedValue(new Error("DB error"));
        const req = buildLoginRequest({ email: "alice@example.com", password: "pass1234" });

        const response = await AuthController.login(req);
        const body = await response.json();

        expect(response.status).toBe(500);
        expect(body.code).toBe("ERROR_GENERIC");
      });
    });
  });

  describe("logout", () => {
    it("should return 200 with success code", async () => {
      const response = AuthController.logout();
      const body: { code: string; message: string } = await response.json();

      expect(response.status).toBe(200);
      expect(body.code).toBe("SUCCESS_LOGOUT");
    });

    it("should clear the auth-token cookie", () => {
      const response = AuthController.logout();
      const setCookie = response.headers.get("set-cookie");

      expect(setCookie).toContain("auth-token");
    });
  });
});
