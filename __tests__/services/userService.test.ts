import { http, HttpResponse } from "msw";

import type { IUser } from "@/types/models";
import type { ResponseWithData } from "@/types/responses";

import userService from "@/services/userService";

import { mockMswServer } from "@tests/__mocks__/mswServer.mock";
import { mockUser, mockUsers } from "@tests/__mocks__/user.mock";

describe("userService", () => {
  describe("getAll", () => {
    it("should return all users on success", async () => {
      const mockResponse: ResponseWithData<IUser[]> = {
        code: "SUCCESS_GET_ALL_USERS",
        message: "Users retrieved",
        data: mockUsers,
      };
      mockMswServer.use(
        http.get("http://localhost/api/v1/users", () => HttpResponse.json(mockResponse))
      );

      const result = await userService.getAll();

      expect(result).toEqual(mockResponse);
    });

    it("should send GET to /api/v1/users", async () => {
      const mockRequestSpy = jest.fn();
      mockMswServer.use(
        http.get("http://localhost/api/v1/users", ({ request }) => {
          mockRequestSpy(request.method);
          return HttpResponse.json({ code: "SUCCESS", message: "ok", data: [] });
        })
      );

      await userService.getAll();

      expect(mockRequestSpy).toHaveBeenCalledWith("GET");
    });

    it("should throw error with HTTP status when response is not ok", async () => {
      mockMswServer.use(
        http.get("http://localhost/api/v1/users", () => new HttpResponse(null, { status: 500 }))
      );

      await expect(userService.getAll()).rejects.toThrow("HTTP error! status: 500");
    });

    it("should throw an Error instance when response is not ok", async () => {
      mockMswServer.use(
        http.get("http://localhost/api/v1/users", () => new HttpResponse(null, { status: 503 }))
      );

      await expect(userService.getAll()).rejects.toBeInstanceOf(Error);
    });
  });

  describe("getById", () => {
    it("should return user by id on success", async () => {
      const mockResponse: ResponseWithData<IUser> = {
        code: "SUCCESS_GET_USER",
        message: "User retrieved",
        data: mockUser,
      };
      mockMswServer.use(
        http.get("http://localhost/api/v1/users/:id", () => HttpResponse.json(mockResponse))
      );

      const result = await userService.getById("user-id-1");

      expect(result).toEqual(mockResponse);
    });

    it("should send GET to /api/v1/users/:id", async () => {
      const mockUrlSpy = jest.fn();
      mockMswServer.use(
        http.get("http://localhost/api/v1/users/:id", ({ request, params }) => {
          mockUrlSpy(request.method, params.id);
          return HttpResponse.json({ code: "SUCCESS", message: "ok", data: mockUser });
        })
      );

      await userService.getById("user-id-1");

      expect(mockUrlSpy).toHaveBeenCalledWith("GET", "user-id-1");
    });

    it("should throw error with HTTP status when user is not found", async () => {
      mockMswServer.use(
        http.get("http://localhost/api/v1/users/:id", () => new HttpResponse(null, { status: 404 }))
      );

      await expect(userService.getById("non-existent")).rejects.toThrow("HTTP error! status: 404");
    });

    it("should throw an Error instance when response is not ok", async () => {
      mockMswServer.use(
        http.get("http://localhost/api/v1/users/:id", () => new HttpResponse(null, { status: 400 }))
      );

      await expect(userService.getById("bad-id")).rejects.toBeInstanceOf(Error);
    });
  });
});
