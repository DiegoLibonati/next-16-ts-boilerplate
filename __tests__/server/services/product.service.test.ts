/**
 * @jest-environment node
 */

import type { IProduct } from "@/types/models";
import type { ProductCreateBody } from "@/types/zod";

import { ProductDAO } from "@/server/daos/product.dao";

import { ProductService } from "@/server/services/product.service";

import { mockProduct, mockProducts } from "@tests/__mocks__/product.mock";

const mockCreatePayload: ProductCreateBody = {
  name: "New Widget",
  description: "A brand new widget",
  price: 19.99,
};

jest.mock("@/server/daos/product.dao", () => ({
  ProductDAO: {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    deleteById: jest.fn(),
  },
}));

describe("product.service", () => {
  describe("getAllProducts", () => {
    it("should delegate to ProductDAO.getAll and return all products", async () => {
      (ProductDAO.getAll as jest.Mock).mockResolvedValue(mockProducts);

      const result: IProduct[] = await ProductService.getAllProducts();

      expect(ProductDAO.getAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockProducts);
    });

    it("should return an empty array when no products exist", async () => {
      (ProductDAO.getAll as jest.Mock).mockResolvedValue([]);

      const result: IProduct[] = await ProductService.getAllProducts();

      expect(result).toEqual([]);
    });
  });

  describe("getProductById", () => {
    describe("when product exists", () => {
      it("should delegate to ProductDAO.getById and return the product", async () => {
        (ProductDAO.getById as jest.Mock).mockResolvedValue(mockProduct);

        const result: IProduct | null = await ProductService.getProductById("product-id-1");

        expect(ProductDAO.getById).toHaveBeenCalledWith("product-id-1");
        expect(result).toEqual(mockProduct);
      });
    });

    describe("when product does not exist", () => {
      it("should return null when DAO returns null", async () => {
        (ProductDAO.getById as jest.Mock).mockResolvedValue(null);

        const result: IProduct | null = await ProductService.getProductById("nonexistent-id");

        expect(result).toBeNull();
      });
    });
  });

  describe("createProduct", () => {
    it("should delegate to ProductDAO.create with the payload and return created product", async () => {
      (ProductDAO.create as jest.Mock).mockResolvedValue(mockProduct);

      const result: IProduct = await ProductService.createProduct(mockCreatePayload);

      expect(ProductDAO.create).toHaveBeenCalledWith(mockCreatePayload);
      expect(result).toEqual(mockProduct);
    });
  });

  describe("deleteProduct", () => {
    describe("when product exists", () => {
      it("should return true when DAO reports successful deletion", async () => {
        (ProductDAO.deleteById as jest.Mock).mockResolvedValue(true);

        const result: boolean = await ProductService.deleteProduct("product-id-1");

        expect(ProductDAO.deleteById).toHaveBeenCalledWith("product-id-1");
        expect(result).toBe(true);
      });
    });

    describe("when product does not exist", () => {
      it("should return false when DAO reports nothing was deleted", async () => {
        (ProductDAO.deleteById as jest.Mock).mockResolvedValue(false);

        const result: boolean = await ProductService.deleteProduct("nonexistent-id");

        expect(result).toBe(false);
      });
    });
  });
});
