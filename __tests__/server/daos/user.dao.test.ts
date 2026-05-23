/**
 * @jest-environment node
 */

import mongoose from "mongoose";

import type { IUser } from "@/types/models";
import type { UserCreateBody } from "@/types/zod";

import { connectDb } from "@/server/configs/mongo.config";

import { UserDAO } from "@/server/daos/user.dao";

import { UserModel } from "@/server/models/user.model";

import { seedIfEmpty } from "@/server/startup/seed.startup";

jest.mock("@/server/startup/seed.startup");

describe("user.dao", () => {
  beforeAll(async (): Promise<void> => {
    (seedIfEmpty as jest.Mock).mockResolvedValue(undefined);
    global._mongooseCache = undefined;
    await connectDb();
  });

  afterAll(async (): Promise<void> => {
    await mongoose.disconnect();
    global._mongooseCache = undefined;
  });

  beforeEach(async (): Promise<void> => {
    await UserModel.deleteMany({});
  });

  describe("getAll", () => {
    it("should return an empty array when no users exist", async () => {
      const result: IUser[] = await UserDAO.getAll();

      expect(result).toEqual([]);
    });

    it("should return all users as serialized IUser objects", async () => {
      await UserModel.create([
        { name: "Alice", email: "alice@example.com", password: "hash1" },
        { name: "Bob", email: "bob@example.com", password: "hash2" },
      ]);

      const result: IUser[] = await UserDAO.getAll();

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty("_id");
      expect(result[0]).not.toHaveProperty("password");
    });

    it("should return serialized users with string ISO dates", async () => {
      await UserModel.create({ name: "Alice", email: "alice@example.com", password: "hash1" });

      const result: IUser[] = await UserDAO.getAll();

      expect(typeof result[0]!.createdAt).toBe("string");
      expect(typeof result[0]!.updatedAt).toBe("string");
    });
  });

  describe("getById", () => {
    it("should return the user when found", async () => {
      const created = await UserModel.create({
        name: "Alice",
        email: "alice@example.com",
        password: "hash1",
      });

      const result: IUser | null = await UserDAO.getById(created._id.toString());

      expect(result).not.toBeNull();
      expect(result?._id).toBe(created._id.toString());
      expect(result?.email).toBe("alice@example.com");
    });

    it("should not include password in the returned user", async () => {
      const created = await UserModel.create({
        name: "Alice",
        email: "alice@example.com",
        password: "hash1",
      });

      const result: IUser | null = await UserDAO.getById(created._id.toString());

      expect((result as unknown as Record<string, unknown>).password).toBeUndefined();
    });

    it("should return null when the user does not exist", async () => {
      const fakeId: string = new mongoose.Types.ObjectId().toString();

      const result: IUser | null = await UserDAO.getById(fakeId);

      expect(result).toBeNull();
    });

    it("should return null when the id is not a valid ObjectId", async () => {
      const result: IUser | null = await UserDAO.getById("not-a-valid-id");

      expect(result).toBeNull();
    });
  });

  describe("create", () => {
    it("should insert a user and return it with a generated _id", async () => {
      const result: IUser = await UserDAO.create({
        name: "Carol",
        email: "carol@example.com",
        password: "hash123",
      } as unknown as UserCreateBody);

      expect(result._id).toBeDefined();
      expect(result.name).toBe("Carol");
      expect(result.email).toBe("carol@example.com");
    });

    it("should persist the user to the database", async () => {
      const result: IUser = await UserDAO.create({
        name: "Carol",
        email: "carol@example.com",
        password: "hash123",
      } as unknown as UserCreateBody);

      const fromDb = await UserModel.findById(result._id);
      expect(fromDb).not.toBeNull();
      expect(fromDb?.email).toBe("carol@example.com");
    });

    it("should not expose password in the returned IUser", async () => {
      const result: IUser = await UserDAO.create({
        name: "Carol",
        email: "carol@example.com",
        password: "hash123",
      } as unknown as UserCreateBody);

      expect((result as unknown as Record<string, unknown>).password).toBeUndefined();
    });
  });

  describe("deleteById", () => {
    it("should return true and remove the user when found", async () => {
      const created = await UserModel.create({
        name: "Alice",
        email: "alice@example.com",
        password: "hash1",
      });

      const result: boolean = await UserDAO.deleteById(created._id.toString());

      expect(result).toBe(true);
      const fromDb = await UserModel.findById(created._id);
      expect(fromDb).toBeNull();
    });

    it("should return false when the user does not exist", async () => {
      const fakeId: string = new mongoose.Types.ObjectId().toString();

      const result: boolean = await UserDAO.deleteById(fakeId);

      expect(result).toBe(false);
    });
  });
});
