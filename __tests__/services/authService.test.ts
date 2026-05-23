import { http, HttpResponse } from "msw";

import type { DefaultResponse } from "@/types/responses";

import authService from "@/services/authService";

import { mockMswServer } from "@tests/__mocks__/mswServer.mock";

const mockLoginSuccess: DefaultResponse = {
  code: "SUCCESS_LOGIN",
  message: "Logged in successfully",
};

const mockLogoutSuccess: DefaultResponse = {
  code: "SUCCESS_LOGOUT",
  message: "Logged out successfully",
};

describe("authService", () => {
  describe("login", () => {
    it("should return response data on successful login", async () => {
      mockMswServer.use(
        http.post("http://localhost/api/v1/auth/login", () => HttpResponse.json(mockLoginSuccess))
      );

      const result = await authService.login("alice@example.com", "demo1234");

      expect(result).toEqual(mockLoginSuccess);
    });

    it("should send POST to /api/v1/auth/login with credentials", async () => {
      const mockBodySpy = jest.fn();
      mockMswServer.use(
        http.post("http://localhost/api/v1/auth/login", async ({ request }) => {
          const body = await request.json();
          mockBodySpy(request.method, body, request.headers.get("content-type"));
          return HttpResponse.json(mockLoginSuccess);
        })
      );

      await authService.login("alice@example.com", "demo1234");

      expect(mockBodySpy).toHaveBeenCalledWith(
        "POST",
        { email: "alice@example.com", password: "demo1234" },
        "application/json"
      );
    });

    it("should throw error with message from response when login fails", async () => {
      const errorResponse: DefaultResponse = {
        code: "ERROR_INVALID_CREDENTIALS",
        message: "Invalid credentials",
      };
      mockMswServer.use(
        http.post(
          "http://localhost/api/v1/auth/login",
          () => new HttpResponse(JSON.stringify(errorResponse), { status: 401 })
        )
      );

      await expect(authService.login("bad@example.com", "wrong")).rejects.toThrow(
        "Invalid credentials"
      );
    });

    it("should throw an Error instance when login fails", async () => {
      mockMswServer.use(
        http.post(
          "http://localhost/api/v1/auth/login",
          () =>
            new HttpResponse(JSON.stringify({ code: "ERROR_GENERIC", message: "Server error" }), {
              status: 500,
            })
        )
      );

      await expect(authService.login("a@b.com", "pass")).rejects.toBeInstanceOf(Error);
    });
  });

  describe("logout", () => {
    it("should return response data on successful logout", async () => {
      mockMswServer.use(
        http.post("http://localhost/api/v1/auth/logout", () => HttpResponse.json(mockLogoutSuccess))
      );

      const result = await authService.logout();

      expect(result).toEqual(mockLogoutSuccess);
    });

    it("should send POST to /api/v1/auth/logout", async () => {
      const mockRequestSpy = jest.fn();
      mockMswServer.use(
        http.post("http://localhost/api/v1/auth/logout", ({ request }) => {
          mockRequestSpy(request.method);
          return HttpResponse.json(mockLogoutSuccess);
        })
      );

      await authService.logout();

      expect(mockRequestSpy).toHaveBeenCalledWith("POST");
    });

    it("should throw error with message from response when logout fails", async () => {
      const errorResponse: DefaultResponse = {
        code: "ERROR_GENERIC",
        message: "Logout failed",
      };
      mockMswServer.use(
        http.post(
          "http://localhost/api/v1/auth/logout",
          () => new HttpResponse(JSON.stringify(errorResponse), { status: 500 })
        )
      );

      await expect(authService.logout()).rejects.toThrow("Logout failed");
    });

    it("should throw an Error instance when logout fails", async () => {
      mockMswServer.use(
        http.post(
          "http://localhost/api/v1/auth/logout",
          () =>
            new HttpResponse(JSON.stringify({ code: "ERROR_GENERIC", message: "Server error" }), {
              status: 500,
            })
        )
      );

      await expect(authService.logout()).rejects.toBeInstanceOf(Error);
    });
  });
});
