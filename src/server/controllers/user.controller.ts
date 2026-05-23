import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

import { UserService } from "@/server/services/user.service";

import { userIdParamsSchema } from "@/server/schemas/user.schema";

import { NotFoundError } from "@/server/errors/not_found.error";

import { validateParams } from "@/server/helpers/validate.helper";
import { withErrorHandler } from "@/server/helpers/with_error_handler.helper";

import { CODES_NOT, CODES_SUCCESS } from "@/server/constants/codes.constant";
import { MESSAGES_NOT, MESSAGES_SUCCESS } from "@/server/constants/messages.constant";

export const UserController = {
  getAll: withErrorHandler(
    "UserController.getAll",
    async (_req: NextRequest): Promise<NextResponse> => {
      const users = await UserService.getAllUsers();
      return NextResponse.json(
        {
          code: CODES_SUCCESS.getAllUsers,
          message: MESSAGES_SUCCESS.getAllUsers,
          data: users,
        },
        { status: 200 }
      );
    }
  ),

  getById: withErrorHandler(
    "UserController.getById",
    async (_req: NextRequest, rawParams: unknown): Promise<NextResponse> => {
      const { id } = validateParams(rawParams, userIdParamsSchema);

      const user = await UserService.getUserById(id);
      if (!user) throw new NotFoundError(CODES_NOT.foundUser, MESSAGES_NOT.foundUser);

      return NextResponse.json(
        {
          code: CODES_SUCCESS.getUser,
          message: MESSAGES_SUCCESS.getUser,
          data: user,
        },
        { status: 200 }
      );
    }
  ),
};
