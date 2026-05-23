import type { IProductDoc, IUserDoc } from "@/types/api";
import type { IProduct, IUser } from "@/types/models";

import { idToString } from "@/server/helpers/id_to_string.helper";

export const serializeProduct = (doc: IProductDoc): IProduct => {
  return {
    _id: idToString(doc._id),
    name: doc.name,
    description: doc.description,
    price: doc.price,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
};

export const serializeUser = (doc: IUserDoc): IUser => {
  return {
    _id: idToString(doc._id),
    name: doc.name,
    email: doc.email,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
};
