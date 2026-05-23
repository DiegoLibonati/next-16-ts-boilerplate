import mongoose from "mongoose";

import type { IProduct } from "@/types/models";
import type { ProductCreateBody } from "@/types/zod";

import { connectDb } from "@/server/configs/mongo.config";

import { ProductModel } from "@/server/models/product.model";

import { serializeProduct } from "@/server/helpers/serialize.helper";

export const ProductDAO = {
  async getAll(): Promise<IProduct[]> {
    await connectDb();
    const docs = await ProductModel.find().exec();
    return docs.map(serializeProduct);
  },
  async getById(id: string): Promise<IProduct | null> {
    if (!mongoose.isValidObjectId(id)) return null;
    await connectDb();
    const doc = await ProductModel.findById(id).exec();
    return doc ? serializeProduct(doc) : null;
  },
  async create(data: ProductCreateBody): Promise<IProduct> {
    await connectDb();
    const doc = await ProductModel.create(data);
    return serializeProduct(doc);
  },
  async deleteById(id: string): Promise<boolean> {
    await connectDb();
    const result = await ProductModel.findByIdAndDelete(id).exec();
    return result !== null;
  },
};
