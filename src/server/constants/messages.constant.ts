import type { MessagesError, MessagesNot, MessagesSuccess } from "@/types/api";

export const MESSAGES_SUCCESS: MessagesSuccess = {
  getAllUsers: "Users successfully retrieved.",
  getUser: "User successfully retrieved.",
  getAllProducts: "Products successfully retrieved.",
  getProduct: "Product successfully retrieved.",
  login: "Login successful.",
  logout: "Logout successful.",
  healthLive: "Service is alive.",
  healthReady: "Service is ready.",
};

export const MESSAGES_NOT: MessagesNot = {
  foundRoute: "Route not found.",
  foundUser: "User not found.",
  foundProduct: "Product not found.",
  validId: "A valid ID is required.",
};

export const MESSAGES_ERROR: MessagesError = {
  generic: "Something went wrong.",
  unauthorized: "Unauthorized.",
  forbidden: "Forbidden.",
  rateLimit: "Too many requests. Please try again later.",
  invalidCredentials: "Invalid credentials.",
  requiredFields: "Email and password are required.",
  validation: "Validation failed.",
};
