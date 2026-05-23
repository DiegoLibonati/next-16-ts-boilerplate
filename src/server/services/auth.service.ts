import { compare } from "@node-rs/bcrypt";
import { SignJWT } from "jose";

import { connectDb } from "@/server/configs/mongo.config";
import { getJwtSecret } from "@/server/configs/jwt.config";

import {
  JWT_ALGORITHM,
  JWT_AUDIENCE,
  JWT_EXPIRATION,
  JWT_ISSUER,
} from "@/server/constants/vars.constant";

import { UserModel } from "@/server/models/user.model";

export const AuthService = {
  async login(email: string, password: string): Promise<string | null> {
    await connectDb();

    const user = await UserModel.findOne({ email: email.toLowerCase() }).select("+password").exec();

    if (!user) return null;

    const valid = await compare(password, user.password);
    if (!valid) return null;

    return new SignJWT({ sub: String(user._id), email: user.email })
      .setProtectedHeader({ alg: JWT_ALGORITHM })
      .setIssuedAt()
      .setIssuer(JWT_ISSUER)
      .setAudience(JWT_AUDIENCE)
      .setExpirationTime(JWT_EXPIRATION)
      .sign(getJwtSecret());
  },
};
