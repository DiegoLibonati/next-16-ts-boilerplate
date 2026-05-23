import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

import { getEnvs } from "@/server/configs/env.config";

import { AuthService } from "@/server/services/auth.service";

import { loginBodySchema } from "@/server/schemas/auth.schema";

import { UnauthorizedError } from "@/server/errors/unauthorized.error";

import { validateBody } from "@/server/helpers/validate.helper";
import { withErrorHandler } from "@/server/helpers/with_error_handler.helper";

import { CODES_ERROR, CODES_SUCCESS } from "@/server/constants/codes.constant";
import { MESSAGES_ERROR, MESSAGES_SUCCESS } from "@/server/constants/messages.constant";
import { COOKIE_MAX_AGE, COOKIE_NAME } from "@/server/constants/vars.constant";

export const AuthController = {
  login: withErrorHandler(
    "AuthController.login",
    async (req: NextRequest): Promise<NextResponse> => {
      const { email, password } = await validateBody(req, loginBodySchema);

      const token = await AuthService.login(email, password);
      if (!token) {
        throw new UnauthorizedError(
          CODES_ERROR.invalidCredentials,
          MESSAGES_ERROR.invalidCredentials
        );
      }

      const response = NextResponse.json(
        {
          code: CODES_SUCCESS.login,
          message: MESSAGES_SUCCESS.login,
        },
        { status: 200 }
      );
      response.cookies.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: getEnvs().ENV === "production",
        sameSite: "lax",
        maxAge: COOKIE_MAX_AGE,
        path: "/",
      });
      return response;
    }
  ),

  logout: (): NextResponse => {
    const response = NextResponse.json(
      {
        code: CODES_SUCCESS.logout,
        message: MESSAGES_SUCCESS.logout,
      },
      { status: 200 }
    );
    response.cookies.delete(COOKIE_NAME);
    return response;
  },
};
