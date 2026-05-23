import type { IUser } from "@/types/models";
import type { UserCreateBody } from "@/types/zod";

import { UserDAO } from "@/server/daos/user.dao";

export const UserService = {
  async getAllUsers(): Promise<IUser[]> {
    return UserDAO.getAll();
  },

  async getUserById(id: string): Promise<IUser | null> {
    return UserDAO.getById(id);
  },

  async createUser(data: UserCreateBody): Promise<IUser> {
    return UserDAO.create(data);
  },

  async deleteUser(id: string): Promise<boolean> {
    return UserDAO.deleteById(id);
  },
};
