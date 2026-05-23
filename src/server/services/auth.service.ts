import { compare } from "@node-rs/bcrypt";

import { connectDb } from "@/server/configs/mongo.config";
import { Jwt } from "@/server/configs/jwt.config";

import { UserModel } from "@/server/models/user.model";

export const AuthService = {
  async login(email: string, password: string): Promise<string | null> {
    await connectDb();

    const user = await UserModel.findOne({ email: email.toLowerCase() }).select("+password").exec();

    if (!user) return null;

    const valid = await compare(password, user.password);
    if (!valid) return null;

    return new Jwt({ payload: { sub: String(user._id), email: user.email } }).signJWT();
  },
};
