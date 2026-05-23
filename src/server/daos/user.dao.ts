import mongoose from "mongoose";

import type { IUser } from "@/types/models";
import type { UserCreateBody } from "@/types/zod";

import { connectDb } from "@/server/configs/mongo.config";

import { UserModel } from "@/server/models/user.model";

import { serializeUser } from "@/server/helpers/serialize.helper";

export const UserDAO = {
  async getAll(): Promise<IUser[]> {
    await connectDb();
    const docs = await UserModel.find().exec();
    return docs.map(serializeUser);
  },

  async getById(id: string): Promise<IUser | null> {
    if (!mongoose.isValidObjectId(id)) return null;

    await connectDb();
    const doc = await UserModel.findById(id).exec();
    return doc ? serializeUser(doc) : null;
  },

  async create(data: UserCreateBody): Promise<IUser> {
    await connectDb();
    const doc = await UserModel.create(data);
    return serializeUser(doc);
  },

  async deleteById(id: string): Promise<boolean> {
    await connectDb();
    const result = await UserModel.findByIdAndDelete(id).exec();
    return result !== null;
  },
};
