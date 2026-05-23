import { cookies } from "next/headers";
import { jwtVerify } from "jose";

import type { Session } from "@/types/api";

import { getJwtSecret } from "@/server/configs/jwt.config";

import {
  COOKIE_NAME,
  JWT_ALGORITHM,
  JWT_AUDIENCE,
  JWT_ISSUER,
} from "@/server/constants/vars.constant";

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getJwtSecret(), {
      algorithms: [JWT_ALGORITHM],
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });
    return {
      sub: String(payload.sub),
      email: String(payload.email),
    };
  } catch {
    return null;
  }
}
