import type { Document } from "mongoose";
import type { Product, User } from "@/types/app";
import type { Env, LogLevel } from "@/types/cross";

export interface Session {
  sub: string;
  email: string;
}

export interface JWTConfig {
  payload?: Record<string, unknown>;
  token?: string;
}

export interface RateBucket {
  count: number;
  resetAt: number;
}

export interface ExceptionInfo {
  status: number;
  code: string;
  message: string;
}

export type IProductDoc = Document &
  Product & {
    createdAt: Date;
    updatedAt: Date;
  };

export interface IUserDoc extends Document, User {
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Envs {
  PORT: number;
  ENV: Env;
  JWT_SECRET: string;
  DATABASE_URL: string;
  LOG_LEVEL: LogLevel;
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX: number;
  BODY_LIMIT: string;
  SEED_DEFAULT_DATA: boolean;
}

export interface CodesSuccess {
  getAllUsers: "SUCCESS_GET_ALL_USERS";
  getUser: "SUCCESS_GET_USER";
  getAllProducts: "SUCCESS_GET_ALL_PRODUCTS";
  getProduct: "SUCCESS_GET_PRODUCT";
  login: "SUCCESS_LOGIN";
  logout: "SUCCESS_LOGOUT";
  healthLive: "SUCCESS_HEALTH_LIVE";
  healthReady: "SUCCESS_HEALTH_READY";
}

export interface CodesNot {
  foundRoute: "NOT_FOUND_ROUTE";
  foundUser: "NOT_FOUND_USER";
  foundProduct: "NOT_FOUND_PRODUCT";
  validId: "NOT_VALID_ID";
}

export interface CodesError {
  generic: "ERROR_GENERIC";
  unauthorized: "ERROR_UNAUTHORIZED";
  forbidden: "ERROR_FORBIDDEN";
  rateLimit: "ERROR_RATE_LIMIT";
  invalidCredentials: "ERROR_INVALID_CREDENTIALS";
  requiredFields: "ERROR_REQUIRED_FIELDS";
  validation: "ERROR_VALIDATION";
  malformedBody: "ERROR_MALFORMED_BODY";
}

export interface MessagesSuccess {
  getAllUsers: string;
  getUser: string;
  getAllProducts: string;
  getProduct: string;
  login: string;
  logout: string;
  healthLive: string;
  healthReady: string;
}

export interface MessagesNot {
  foundRoute: string;
  foundUser: string;
  foundProduct: string;
  validId: string;
}

export interface MessagesError {
  generic: string;
  unauthorized: string;
  forbidden: string;
  rateLimit: string;
  invalidCredentials: string;
  requiredFields: string;
  validation: string;
  malformedBody: string;
}
