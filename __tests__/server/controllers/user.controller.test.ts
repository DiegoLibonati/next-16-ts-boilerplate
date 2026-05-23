/**
 * @jest-environment node
 */

import { NextRequest } from "next/server";

import type { IUser } from "@/types/models";

import { UserController } from "@/server/controllers/user.controller";

import { UserService } from "@/server/services/user.service";

import { mockUser, mockUsers } from "@tests/__mocks__/user.mock";

const validId = "507f1f77bcf86cd799439011";

jest.mock("@/server/services/user.service", () => ({
  UserService: {
    getAllUsers: jest.fn(),
    getUserById: jest.fn(),
  },
}));

const buildGetRequest = (url: string): NextRequest => new NextRequest(`http://localhost${url}`);

describe("user.controller", () => {
  describe("getAll", () => {
    describe("when service returns users", () => {
      it("should return 200 with user data array", async () => {
        (UserService.getAllUsers as jest.Mock).mockResolvedValue(mockUsers);
        const req = buildGetRequest("/api/v1/users");

        const response = await UserController.getAll(req);
        const body: { data: IUser[] } = await response.json();

        expect(response.status).toBe(200);
        expect(body.data).toEqual(mockUsers);
      });

      it("should return 200 with empty array when no users exist", async () => {
        (UserService.getAllUsers as jest.Mock).mockResolvedValue([]);
        const req = buildGetRequest("/api/v1/users");

        const response = await UserController.getAll(req);
        const body: { data: IUser[] } = await response.json();

        expect(response.status).toBe(200);
        expect(body.data).toEqual([]);
      });
    });

    describe("when service throws an error", () => {
      beforeEach(() => {
        jest.spyOn(console, "error").mockImplementation(() => undefined);
      });

      it("should return 500 with ERROR_GENERIC code", async () => {
        (UserService.getAllUsers as jest.Mock).mockRejectedValue(new Error("DB failure"));
        const req = buildGetRequest("/api/v1/users");

        const response = await UserController.getAll(req);
        const body: { code: string } = await response.json();

        expect(response.status).toBe(500);
        expect(body.code).toBe("ERROR_GENERIC");
      });
    });
  });

  describe("getById", () => {
    describe("when the user exists", () => {
      it("should return 200 with the user data", async () => {
        (UserService.getUserById as jest.Mock).mockResolvedValue(mockUser);
        const req = buildGetRequest(`/api/v1/users/${validId}`);

        const response = await UserController.getById(req, { id: validId });
        const body: { data: IUser } = await response.json();

        expect(response.status).toBe(200);
        expect(body.data).toEqual(mockUser);
      });

      it("should pass the id to UserService.getUserById", async () => {
        (UserService.getUserById as jest.Mock).mockResolvedValue(mockUser);
        const req = buildGetRequest(`/api/v1/users/${validId}`);

        await UserController.getById(req, { id: validId });

        expect(UserService.getUserById).toHaveBeenCalledWith(validId);
      });
    });

    describe("when the user is not found", () => {
      it("should return 404 when service returns null", async () => {
        (UserService.getUserById as jest.Mock).mockResolvedValue(null);
        const req = buildGetRequest(`/api/v1/users/${validId}`);

        const response = await UserController.getById(req, { id: validId });
        const body: { code: string; message: string } = await response.json();

        expect(response.status).toBe(404);
        expect(body.code).toBe("NOT_FOUND_USER");
        expect(body.message).toBe("User not found.");
      });
    });

    describe("when the id is invalid", () => {
      it("should return 400 when the id is not a valid ObjectId", async () => {
        const req = buildGetRequest("/api/v1/users/not-an-objectid");

        const response = await UserController.getById(req, { id: "not-an-objectid" });
        const body: { code: string } = await response.json();

        expect(response.status).toBe(400);
        expect(body.code).toBe("ERROR_VALIDATION");
        expect(UserService.getUserById).not.toHaveBeenCalled();
      });
    });

    describe("when service throws an error", () => {
      beforeEach(() => {
        jest.spyOn(console, "error").mockImplementation(() => undefined);
      });

      it("should return 500 with ERROR_GENERIC code on generic error", async () => {
        (UserService.getUserById as jest.Mock).mockRejectedValue(new Error("unexpected"));
        const req = buildGetRequest(`/api/v1/users/${validId}`);

        const response = await UserController.getById(req, { id: validId });
        const body: { code: string } = await response.json();

        expect(response.status).toBe(500);
        expect(body.code).toBe("ERROR_GENERIC");
      });
    });
  });
});
