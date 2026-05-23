import { cookies } from "next/headers";

import type { Session } from "@/types/api";

import { Jwt } from "@/server/configs/jwt.config";

import { COOKIE_NAME } from "@/server/constants/vars.constant";

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const result = await new Jwt({ token }).verifyJWT();
  if (!result) return null;

  return {
    sub: String(result.payload.sub),
    email: String(result.payload.email),
  };
}
