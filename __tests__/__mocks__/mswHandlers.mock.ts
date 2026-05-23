import { http, HttpResponse } from "msw";

export const mockMswHandlers = [
  http.get("http://localhost/api/v1/users", () =>
    HttpResponse.json({ code: "SUCCESS_GET_ALL_USERS", message: "ok", data: [] })
  ),
  http.get("http://localhost/api/v1/products", () =>
    HttpResponse.json({ code: "SUCCESS_GET_ALL_PRODUCTS", message: "ok", data: [] })
  ),
];
