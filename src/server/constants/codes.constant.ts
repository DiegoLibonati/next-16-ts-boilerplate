import type { CodesError, CodesNot, CodesSuccess } from "@/types/api";

export const CODES_SUCCESS: CodesSuccess = {
  getAllUsers: "SUCCESS_GET_ALL_USERS",
  getUser: "SUCCESS_GET_USER",
  getAllProducts: "SUCCESS_GET_ALL_PRODUCTS",
  getProduct: "SUCCESS_GET_PRODUCT",
  login: "SUCCESS_LOGIN",
  logout: "SUCCESS_LOGOUT",
  healthLive: "SUCCESS_HEALTH_LIVE",
  healthReady: "SUCCESS_HEALTH_READY",
};

export const CODES_NOT: CodesNot = {
  foundRoute: "NOT_FOUND_ROUTE",
  foundUser: "NOT_FOUND_USER",
  foundProduct: "NOT_FOUND_PRODUCT",
  validId: "NOT_VALID_ID",
};

export const CODES_ERROR: CodesError = {
  generic: "ERROR_GENERIC",
  unauthorized: "ERROR_UNAUTHORIZED",
  forbidden: "ERROR_FORBIDDEN",
  rateLimit: "ERROR_RATE_LIMIT",
  invalidCredentials: "ERROR_INVALID_CREDENTIALS",
  requiredFields: "ERROR_REQUIRED_FIELDS",
  validation: "ERROR_VALIDATION",
  malformedBody: "ERROR_MALFORMED_BODY",
};
