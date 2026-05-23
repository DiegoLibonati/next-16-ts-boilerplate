/**
 * @jest-environment node
 */

import type { IUser } from "@/types/models";
import type { UserCreateBody } from "@/types/zod";

import { UserDAO } from "@/server/daos/user.dao";

import { UserService } from "@/server/services/user.service";

import { mockUser, mockUsers } from "@tests/__mocks__/user.mock";

const mockCreatePayload: UserCreateBody = {
  name: "Carol New",
  email: "carol@example.com",
};

jest.mock("@/server/daos/user.dao", () => ({
  UserDAO: {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    deleteById: jest.fn(),
  },
}));

describe("user.service", () => {
  describe("getAllUsers", () => {
    it("should delegate to UserDAO.getAll and return all users", async () => {
      (UserDAO.getAll as jest.Mock).mockResolvedValue(mockUsers);

      const result: IUser[] = await UserService.getAllUsers();

      expect(UserDAO.getAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockUsers);
    });

    it("should return an empty array when no users exist", async () => {
      (UserDAO.getAll as jest.Mock).mockResolvedValue([]);

      const result: IUser[] = await UserService.getAllUsers();

      expect(result).toEqual([]);
    });
  });

  describe("getUserById", () => {
    describe("when user exists", () => {
      it("should delegate to UserDAO.getById and return the user", async () => {
        (UserDAO.getById as jest.Mock).mockResolvedValue(mockUser);

        const result: IUser | null = await UserService.getUserById("user-id-1");

        expect(UserDAO.getById).toHaveBeenCalledWith("user-id-1");
        expect(result).toEqual(mockUser);
      });
    });

    describe("when user does not exist", () => {
      it("should return null when DAO returns null", async () => {
        (UserDAO.getById as jest.Mock).mockResolvedValue(null);

        const result: IUser | null = await UserService.getUserById("nonexistent-id");

        expect(result).toBeNull();
      });
    });
  });

  describe("createUser", () => {
    it("should delegate to UserDAO.create with the payload and return created user", async () => {
      (UserDAO.create as jest.Mock).mockResolvedValue(mockUser);

      const result: IUser = await UserService.createUser(mockCreatePayload);

      expect(UserDAO.create).toHaveBeenCalledWith(mockCreatePayload);
      expect(result).toEqual(mockUser);
    });
  });

  describe("deleteUser", () => {
    describe("when user exists", () => {
      it("should return true when DAO reports successful deletion", async () => {
        (UserDAO.deleteById as jest.Mock).mockResolvedValue(true);

        const result: boolean = await UserService.deleteUser("user-id-1");

        expect(UserDAO.deleteById).toHaveBeenCalledWith("user-id-1");
        expect(result).toBe(true);
      });
    });

    describe("when user does not exist", () => {
      it("should return false when DAO reports nothing was deleted", async () => {
        (UserDAO.deleteById as jest.Mock).mockResolvedValue(false);

        const result: boolean = await UserService.deleteUser("nonexistent-id");

        expect(result).toBe(false);
      });
    });
  });
});
