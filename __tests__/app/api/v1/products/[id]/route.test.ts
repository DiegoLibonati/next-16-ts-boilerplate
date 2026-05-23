/**
 * @jest-environment node
 */

import { NextRequest, NextResponse } from "next/server";

import { ProductController } from "@/server/controllers/product.controller";

import { GET } from "@/app/api/v1/products/[id]/route";

jest.mock("@/server/controllers/product.controller");

const buildRequest = (id: string): NextRequest =>
  new NextRequest(`http://localhost:3000/api/v1/products/${id}`);

describe("route", () => {
  describe("GET /api/v1/products/:id", () => {
    it("should delegate to ProductController.getById with the awaited params object", async () => {
      const mockResponse = new NextResponse(JSON.stringify({ _id: "product-id-1" }), {
        status: 200,
      });
      jest.mocked(ProductController.getById).mockResolvedValue(mockResponse);

      const req = buildRequest("product-id-1");
      const response = await GET(req, { params: Promise.resolve({ id: "product-id-1" }) });

      expect(ProductController.getById).toHaveBeenCalledWith(req, { id: "product-id-1" });
      expect(response).toBe(mockResponse);
    });

    it("should resolve the params promise before passing to the controller", async () => {
      const mockResponse = new NextResponse(null, { status: 200 });
      jest.mocked(ProductController.getById).mockResolvedValue(mockResponse);

      const req = buildRequest("abc123");
      await GET(req, { params: Promise.resolve({ id: "abc123" }) });

      const [, calledParams] = jest.mocked(ProductController.getById).mock.calls[0]!;
      expect(calledParams).toEqual({ id: "abc123" });
    });

    it("should return the controller response status", async () => {
      const mockResponse = new NextResponse(JSON.stringify({ error: "Not found" }), {
        status: 404,
      });
      jest.mocked(ProductController.getById).mockResolvedValue(mockResponse);

      const req = buildRequest("nonexistent");
      const response = await GET(req, { params: Promise.resolve({ id: "nonexistent" }) });

      expect(response.status).toBe(404);
    });
  });
});
