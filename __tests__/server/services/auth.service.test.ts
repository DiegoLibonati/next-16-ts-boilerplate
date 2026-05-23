/**
 * @jest-environment node
 */

import { compare } from "@node-rs/bcrypt";
import { SignJWT } from "jose";

import { connectDb } from "@/server/configs/mongo.config";
import { getJwtSecret } from "@/server/configs/jwt.config";

import { UserModel } from "@/server/models/user.model";

import { AuthService } from "@/server/services/auth.service";

import { mockUserDoc } from "@tests/__mocks__/user.mock";

jest.mock("@/server/configs/mongo.config", () => ({
  connectDb: jest.fn(),
}));

jest.mock("@/server/configs/jwt.config", () => ({
  getJwtSecret: jest.fn(),
}));

jest.mock("@/server/models/user.model", () => ({
  UserModel: { findOne: jest.fn() },
}));

jest.mock("@node-rs/bcrypt", () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

jest.mock("jose", () => ({
  SignJWT: jest.fn(),
}));

describe("auth.service", () => {
  describe("AuthService.login", () => {
    beforeEach((): void => {
      (connectDb as jest.Mock).mockResolvedValue(undefined);
      (getJwtSecret as jest.Mock).mockReturnValue(new Uint8Array([1, 2, 3]));
      (compare as jest.Mock).mockResolvedValue(true);
      (UserModel.findOne as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockUserDoc),
        }),
      });
      (SignJWT as jest.Mock).mockImplementation(() => ({
        setProtectedHeader: jest.fn().mockReturnThis(),
        setIssuedAt: jest.fn().mockReturnThis(),
        setIssuer: jest.fn().mockReturnThis(),
        setAudience: jest.fn().mockReturnThis(),
        setExpirationTime: jest.fn().mockReturnThis(),
        sign: jest.fn().mockResolvedValue("mock.jwt.token"),
      }));
    });

    describe("when credentials are valid", () => {
      it("should return a JWT token string", async () => {
        const result: string | null = await AuthService.login("alice@example.com", "pass123");

        expect(result).toBe("mock.jwt.token");
      });

      it("should call compare with the plain password and hashed password", async () => {
        await AuthService.login("alice@example.com", "pass123");

        expect(compare).toHaveBeenCalledWith("pass123", "hashed-password");
      });

      it("should search by lowercased email", async () => {
        await AuthService.login("ALICE@EXAMPLE.COM", "pass123");

        expect(UserModel.findOne).toHaveBeenCalledWith({ email: "alice@example.com" });
      });

      it("should select the password field", async () => {
        const mockExec = jest.fn().mockResolvedValue(mockUserDoc);
        const mockSelect = jest.fn().mockReturnValue({ exec: mockExec });
        (UserModel.findOne as jest.Mock).mockReturnValue({ select: mockSelect });

        await AuthService.login("alice@example.com", "pass123");

        expect(mockSelect).toHaveBeenCalledWith("+password");
      });

      it("should sign the JWT using the secret from getJwtSecret", async () => {
        const mockSecret = new Uint8Array([9, 8, 7]);
        (getJwtSecret as jest.Mock).mockReturnValue(mockSecret);
        const mockSign = jest.fn().mockResolvedValue("signed.token");
        (SignJWT as jest.Mock).mockImplementation(() => ({
          setProtectedHeader: jest.fn().mockReturnThis(),
          setIssuedAt: jest.fn().mockReturnThis(),
          setIssuer: jest.fn().mockReturnThis(),
          setAudience: jest.fn().mockReturnThis(),
          setExpirationTime: jest.fn().mockReturnThis(),
          sign: mockSign,
        }));

        await AuthService.login("alice@example.com", "pass123");

        expect(mockSign).toHaveBeenCalledWith(mockSecret);
      });
    });

    describe("when the user does not exist", () => {
      it("should return null when user is not found", async () => {
        (UserModel.findOne as jest.Mock).mockReturnValue({
          select: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(null),
          }),
        });

        const result: string | null = await AuthService.login("unknown@example.com", "pass123");

        expect(result).toBeNull();
      });

      it("should not call compare when user is not found", async () => {
        (UserModel.findOne as jest.Mock).mockReturnValue({
          select: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(null),
          }),
        });

        await AuthService.login("unknown@example.com", "pass123");

        expect(compare).not.toHaveBeenCalled();
      });
    });

    describe("when the password is wrong", () => {
      it("should return null when compare returns false", async () => {
        (compare as jest.Mock).mockResolvedValue(false);

        const result: string | null = await AuthService.login("alice@example.com", "wrong");

        expect(result).toBeNull();
      });

      it("should not sign a JWT when password is invalid", async () => {
        (compare as jest.Mock).mockResolvedValue(false);

        await AuthService.login("alice@example.com", "wrong");

        expect(SignJWT).not.toHaveBeenCalled();
      });
    });
  });
});
