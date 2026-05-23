import { http, HttpResponse } from "msw";

import type { IProduct } from "@/types/models";
import type { ResponseWithData } from "@/types/responses";

import productService from "@/services/productService";

import { mockMswServer } from "@tests/__mocks__/mswServer.mock";
import { mockProduct, mockProducts } from "@tests/__mocks__/product.mock";

describe("productService", () => {
  describe("getAll", () => {
    it("should return all products on success", async () => {
      const mockResponse: ResponseWithData<IProduct[]> = {
        code: "SUCCESS_GET_ALL_PRODUCTS",
        message: "Products retrieved",
        data: mockProducts,
      };
      mockMswServer.use(
        http.get("http://localhost/api/v1/products", () => HttpResponse.json(mockResponse))
      );

      const result = await productService.getAll();

      expect(result).toEqual(mockResponse);
    });

    it("should send GET to /api/v1/products", async () => {
      const mockRequestSpy = jest.fn();
      mockMswServer.use(
        http.get("http://localhost/api/v1/products", ({ request }) => {
          mockRequestSpy(request.method);
          return HttpResponse.json({ code: "SUCCESS", message: "ok", data: [] });
        })
      );

      await productService.getAll();

      expect(mockRequestSpy).toHaveBeenCalledWith("GET");
    });

    it("should throw error with HTTP status when response is not ok", async () => {
      mockMswServer.use(
        http.get("http://localhost/api/v1/products", () => new HttpResponse(null, { status: 500 }))
      );

      await expect(productService.getAll()).rejects.toThrow("HTTP error! status: 500");
    });

    it("should throw an Error instance when response is not ok", async () => {
      mockMswServer.use(
        http.get("http://localhost/api/v1/products", () => new HttpResponse(null, { status: 503 }))
      );

      await expect(productService.getAll()).rejects.toBeInstanceOf(Error);
    });
  });

  describe("getById", () => {
    it("should return product by id on success", async () => {
      const mockResponse: ResponseWithData<IProduct> = {
        code: "SUCCESS_GET_PRODUCT",
        message: "Product retrieved",
        data: mockProduct,
      };
      mockMswServer.use(
        http.get("http://localhost/api/v1/products/:id", () => HttpResponse.json(mockResponse))
      );

      const result = await productService.getById("product-id-1");

      expect(result).toEqual(mockResponse);
    });

    it("should send GET to /api/v1/products/:id", async () => {
      const mockUrlSpy = jest.fn();
      mockMswServer.use(
        http.get("http://localhost/api/v1/products/:id", ({ request, params }) => {
          mockUrlSpy(request.method, params.id);
          return HttpResponse.json({ code: "SUCCESS", message: "ok", data: mockProduct });
        })
      );

      await productService.getById("product-id-1");

      expect(mockUrlSpy).toHaveBeenCalledWith("GET", "product-id-1");
    });

    it("should throw error with HTTP status when product is not found", async () => {
      mockMswServer.use(
        http.get(
          "http://localhost/api/v1/products/:id",
          () => new HttpResponse(null, { status: 404 })
        )
      );

      await expect(productService.getById("non-existent")).rejects.toThrow(
        "HTTP error! status: 404"
      );
    });

    it("should throw an Error instance when response is not ok", async () => {
      mockMswServer.use(
        http.get(
          "http://localhost/api/v1/products/:id",
          () => new HttpResponse(null, { status: 400 })
        )
      );

      await expect(productService.getById("bad-id")).rejects.toBeInstanceOf(Error);
    });
  });
});
