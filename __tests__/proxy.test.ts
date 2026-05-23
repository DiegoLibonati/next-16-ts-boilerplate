/**
 * @jest-environment node
 */

import { NextRequest } from "next/server";
import { jwtVerify } from "jose";

import { proxy } from "@/proxy";

jest.mock("jose", () => ({
  jwtVerify: jest.fn(),
}));

jest.mock("@/server/configs/jwt.config", () => ({
  getJwtSecret: jest.fn(() => new Uint8Array([1, 2, 3])),
}));

const buildRequest = (
  url: string,
  init?: { method?: string; headers?: Record<string, string>; cookies?: Record<string, string> }
): NextRequest => {
  const headers = new Headers(init?.headers);
  if (init?.cookies) {
    const cookieHeader = Object.entries(init.cookies)
      .map(([k, v]) => `${k}=${v}`)
      .join("; ");
    headers.set("cookie", cookieHeader);
  }
  return new NextRequest(`http://localhost${url}`, {
    method: init?.method ?? "GET",
    headers,
  });
};

beforeEach((): void => {
  jest.spyOn(console, "warn").mockImplementation((): void => undefined);
});

describe("proxy", () => {
  describe("CSRF protection", () => {
    it("should reject cross-origin POST to /api/ with 403", async () => {
      const req = buildRequest("/api/v1/users", {
        method: "POST",
        headers: { origin: "http://attacker.com", host: "localhost" },
      });

      const response = await proxy(req);

      expect(response.status).toBe(403);
    });

    it("should allow same-origin POST to /api/ when origin matches host", async () => {
      const req = buildRequest("/api/v1/auth/login", {
        method: "POST",
        headers: { origin: "http://localhost", host: "localhost" },
      });

      const response = await proxy(req);

      expect(response.status).not.toBe(403);
    });

    it("should allow GET to /api/ even when cross-origin (safe method)", async () => {
      (jwtVerify as jest.Mock).mockResolvedValue({ payload: {} });
      const req = buildRequest("/api/v1/users", {
        method: "GET",
        headers: { origin: "http://attacker.com", host: "localhost" },
        cookies: { "auth-token": "token" },
      });

      const response = await proxy(req);

      expect(response.status).not.toBe(403);
    });
  });

  describe("public routes", () => {
    it("should not require auth on /api/v1/auth/", async () => {
      const req = buildRequest("/api/v1/auth/login", {
        method: "POST",
        headers: { origin: "http://localhost", host: "localhost" },
      });

      const response = await proxy(req);

      expect(response.status).not.toBe(401);
    });

    it("should not require auth on /api/v1/health/", async () => {
      const req = buildRequest("/api/v1/health/ready");

      const response = await proxy(req);

      expect(response.status).not.toBe(401);
    });
  });

  describe("auth on protected /api/v1/ routes", () => {
    it("should return 401 when no token is provided", async () => {
      const req = buildRequest("/api/v1/users");

      const response = await proxy(req);

      expect(response.status).toBe(401);
    });

    it("should accept a valid bearer token", async () => {
      (jwtVerify as jest.Mock).mockResolvedValue({ payload: { sub: "u1" } });
      const req = buildRequest("/api/v1/users", {
        headers: { authorization: "Bearer good-token" },
      });

      const response = await proxy(req);

      expect(response.status).not.toBe(401);
    });

    it("should accept a valid cookie token", async () => {
      (jwtVerify as jest.Mock).mockResolvedValue({ payload: { sub: "u1" } });
      const req = buildRequest("/api/v1/users", {
        cookies: { "auth-token": "good-token" },
      });

      const response = await proxy(req);

      expect(response.status).not.toBe(401);
    });

    it("should return 401 when jwtVerify throws", async () => {
      (jwtVerify as jest.Mock).mockRejectedValue(new Error("bad token"));
      const req = buildRequest("/api/v1/users", {
        cookies: { "auth-token": "bad-token" },
      });

      const response = await proxy(req);

      expect(response.status).toBe(401);
    });
  });

  describe("non-api routes", () => {
    it("should not require auth on a public page", async () => {
      const req = buildRequest("/about");

      const response = await proxy(req);

      expect(response.status).not.toBe(401);
    });
  });
});
