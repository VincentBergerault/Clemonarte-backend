import request from "supertest";
import app from "@/src/server";
import ProductModel from "@/src/models/product.model";
import { Product } from "@/src/types/types";

describe("User product routes", () => {
  describe("GET /api/product", () => {
    it("should return the list of visible product with user parameters only", async () => {
      const product1 = new ProductModel({
        name: "oeuvre1",
        price: 1,
        src: "src1",
        visible: true,
        description: "aaaa",
        authorDescription: "aaaa",
        materials: ["paint", "canvas"],
      });
      const product2 = new ProductModel({
        name: "oeuvre2",
        price: 2,
        src: "src2",
        visible: false,
        description: "aaaa",
        authorDescription: "aaaa",
        materials: ["paint", "canvas"],
      });

      await product1.save();
      await product2.save();

      const response = await request(app).get("/api/product");
      expect(response.status).toEqual(200);
      expect(Array.isArray(response.body)).toEqual(true);
      expect(response.body.length).toEqual(1);
      response.body.forEach((item: Product) => {
        expect(item).toMatchObject({
          name: expect.any(String),
          price: expect.any(Number),
          src: expect.any(String),
          description: expect.any(String),
          materials: expect.arrayContaining([expect.any(String)]),
        });
      });
    });

    it("should return error 5xx", async () => {
      jest.spyOn(ProductModel, "find").mockImplementation(() => {
        throw new Error("Database error");
      });

      const response = await request(app).get("/api/product");
      expect(response.status).toEqual(500);
    });
  });
});
