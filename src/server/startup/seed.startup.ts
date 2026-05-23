import { hash as bcryptHash } from "@node-rs/bcrypt";

import { getEnvs } from "@/server/configs/env.config";
import { logger } from "@/server/configs/logger.config";

import { UserModel } from "@/server/models/user.model";
import { ProductModel } from "@/server/models/product.model";

export async function seedIfEmpty(): Promise<void> {
  if (!getEnvs().SEED_DEFAULT_DATA) {
    logger.debug("Seed skipped: SEED_DEFAULT_DATA is false");
    return;
  }

  const [userCount, productCount] = await Promise.all([
    UserModel.countDocuments(),
    ProductModel.countDocuments(),
  ]);

  if (userCount === 0) {
    const hash = await bcryptHash("demo1234", 10);
    await UserModel.insertMany([
      { name: "Alice Demo", email: "alice@example.com", password: hash },
      { name: "Bob Demo", email: "bob@example.com", password: hash },
      { name: "Carol Demo", email: "carol@example.com", password: hash },
    ]);
    logger.info("Seeded 3 demo users (password: demo1234)");
  }

  if (productCount === 0) {
    await ProductModel.insertMany([
      {
        name: "Widget Pro",
        description: "A professional-grade widget for power users.",
        price: 29.99,
      },
      {
        name: "Gadget Plus",
        description: "Enhanced gadget with extra features and durability.",
        price: 49.99,
      },
      {
        name: "Doohickey Standard",
        description: "The reliable standard doohickey for everyday tasks.",
        price: 9.99,
      },
    ]);
    logger.info("Seeded 3 demo products");
  }
}
