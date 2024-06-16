import request from "supertest";
import path from "path";
import fs from "fs";
import mongoose from "mongoose";
import app from "@/src/server";
import ProductModel from "@/src/models/product.model";
import ImageModel from "@/src/models/image.model";
import { Product } from "@/src/types/types";

describe("Admin product routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /admin/product", () => {
    it("should return the list of all product", async () => {
      const product1 = new ProductModel({
        name: "test1",
        price: 1,
        src: "test1",
        visible: true,
        description: "test1",
        authorDescription: "test1",
        materials: ["paint", "canvas"],
      });
      const product2 = new ProductModel({
        name: "test2",
        price: 2,
        src: "test2",
        visible: true,
        description: "test2",
        authorDescription: "test2",
        materials: ["paint", "canvas"],
      });

      await product1.save();
      await product2.save();

      const response = await request(app).get("/admin/product");
      expect(response.status).toEqual(200);
      expect(Array.isArray(response.body)).toEqual(true);
      expect(response.body.length).toEqual(2);
      response.body.forEach((item: Product) => {
        expect(item).toMatchObject({
          name: expect.any(String),
          visible: expect.any(Boolean),
          price: expect.any(Number),
          src: expect.any(String),
          description: expect.any(String),
          authorDescription: expect.any(String),
          materials: expect.arrayContaining([expect.any(String)]),
        });
      });
    });

    it("should return error 500 if find operation fails", async () => {
      const errorMessage = "Database error";
      jest.spyOn(ProductModel, "find").mockImplementation(() => {
        throw new Error(errorMessage);
      });

      const response = await request(app).get("/admin/product");
      expect(response.status).toEqual(500);
      expect(response.body).toEqual({ error: errorMessage });
    });
  });

  describe("POST /admin/product", () => {
    it("Should insert a new item in DB and create a file in public directory", async () => {
      const productData = {
        name: "test1",
        price: 2,
        visible: false,
        description: "test1",
        authorDescription: "test1",
        materials: ["paint", "canvas"],
      };
      const imagePath = path.join(__dirname, "../../assets/rickroll.jpg");

      jest.spyOn(ProductModel.prototype, "save").mockImplementationOnce(() => {
        return {
          ...productData,
          _id: "mocked-id",
          src: "mocked-path",
        };
      });
      jest.spyOn(ImageModel.prototype, "save").mockResolvedValue({});

      const response = await request(app)
        .post("/admin/product")
        .field("name", productData.name)
        .field("price", productData.price.toString())
        .field("visible", productData.visible.toString())
        .field("description", productData.description)
        .field("authorDescription", productData.authorDescription)
        .field("materials", JSON.stringify(productData.materials))
        .attach("image", imagePath);

      expect(response.status).toEqual(201);
      expect(response.body).toHaveProperty("_id");
      expect(response.body.name).toEqual(productData.name);
      expect(response.body.price).toEqual(productData.price);
      expect(response.body.src).toBeTruthy();

      const createdImagePath = response.body.src;
      expect(fs.existsSync(createdImagePath)).toEqual(true);

      fs.unlinkSync(createdImagePath);
      expect(fs.existsSync(createdImagePath)).toEqual(false);
    });

    it("should return 500 if there's a server error with ProductModel", async () => {
      const mockSave = jest.spyOn(ProductModel.prototype, "save");
      mockSave.mockImplementationOnce(() => {
        throw new Error("Internal Server Error");
      });

      const imagePath = path.join(__dirname, "../../assets/rickroll.jpg");

      const response = await request(app)
        .post("/admin/product")
        .field("name", "test1")
        .field("price", "2")
        .field("visible", "false")
        .field("description", "test1")
        .field("authorDescription", "test1")
        .field("materials", JSON.stringify(["paint", "canvas"]))
        .attach("image", imagePath);

      expect(response.status).toEqual(500);
      expect(response.body.error).toEqual("Internal Server Error");

      mockSave.mockRestore();
    });

    it("should return 500 if there's a server error with ImageModel", async () => {
      const mockSave = jest.spyOn(ImageModel.prototype, "save");
      mockSave.mockImplementationOnce(() => {
        throw new Error("Internal Server Error");
      });

      const imagePath = path.join(__dirname, "../../assets/rickroll.jpg");

      const response = await request(app)
        .post("/admin/product")
        .field("name", "test1")
        .field("price", "2")
        .field("visible", "false")
        .field("description", "test1")
        .field("authorDescription", "test1")
        .field("materials", JSON.stringify(["paint", "canvas"]))
        .attach("image", imagePath);

      expect(response.status).toEqual(500);
      expect(response.body.error).toEqual("Internal Server Error");

      mockSave.mockRestore();
    });
  });

  describe("PATCH /admin/product/:id", () => {
    it("Should modify an object data in database", async () => {
      const product1 = new ProductModel({
        name: "test1",
        price: 1,
        src: "test1",
        visible: true,
        description: "test1",
        authorDescription: "test1",
        materials: ["paint", "canvas"],
      });

      const item = await product1.save();

      const productData = {
        name: "test2",
        price: 2,
        visible: true,
        description: "test2",
        authorDescription: "test2",
        materials: ["paint", "miguel"],
      };

      const response = await request(app)
        .patch(`/admin/product/${item.id}`)
        .send(productData);

      expect(response.status).toEqual(200);
      expect(response.body._id).toEqual(item.id);
      expect(response.body.name).toEqual(productData.name);
      expect(response.body.price).toEqual(productData.price);
      expect(response.body.visible).toEqual(productData.visible);
      expect(response.body.description).toEqual(productData.description);
      expect(response.body.authorDescription).toEqual(
        productData.authorDescription
      );
      expect(response.body.materials).toStrictEqual(productData.materials);
    });

    it("should return 404 if the product is not found", async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .patch(`/admin/product/${nonExistentId}`)
        .send({ price: 150 });

      expect(res.status).toEqual(404);
      expect(res.body.message).toEqual("Product not found");
    });

    it("should return 500 if there's a server error", async () => {
      const product = new ProductModel({
        name: "test1",
        price: 1,
        src: "test1",
        visible: true,
        description: "test1",
        authorDescription: "test1",
        materials: ["paint", "canvas"],
      });
      await product.save();

      const mockFindByIdAndUpdate = jest.spyOn(
        ProductModel,
        "findByIdAndUpdate"
      );
      mockFindByIdAndUpdate.mockImplementationOnce(() => {
        throw new Error("Internal Server Error");
      });

      const productData = {
        name: "test2",
        price: 2,
        visible: true,
        description: "test2",
        authorDescription: "test2",
        materials: ["paint", "miguel"],
      };

      const res = await request(app)
        .patch(`/admin/product/${product._id}`)
        .send(productData);

      expect(res.status).toEqual(500);
      expect(res.body.error).toEqual("Internal Server Error");

      mockFindByIdAndUpdate.mockRestore();
    });
  });

  describe("DELETE /admin/product/:id", () => {
    it("Should delete element in DB", async () => {
      const sourcePath = path.join(__dirname, "../../assets/rickroll.jpg");
      const publicDir = path.join(__dirname, "../../../../public");
      const destPath = path.join(publicDir, "rickroll.jpg");

      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir);
      }

      fs.copyFileSync(sourcePath, destPath);

      const product1 = new ProductModel({
        name: "test1",
        price: 1,
        src: destPath,
        visible: true,
        description: "test1",
        authorDescription: "test1",
        materials: ["paint", "canvas"],
      });

      const item = await product1.save();

      expect(fs.existsSync(destPath)).toEqual(true);

      const response = await request(app).delete(`/admin/product/${item.id}`);
      expect(response.status).toEqual(204);
      expect(fs.existsSync(destPath)).toEqual(false);
    });

    it("should return 404 if the product is not found", async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const response = await request(app).delete(
        `/admin/product/${nonExistentId}`
      );

      expect(response.status).toEqual(404);
      expect(response.body.message).toEqual("Product not found");
    });

    it("should return 500 if there's a server error", async () => {
      const product = new ProductModel({
        name: "test1",
        price: 1,
        src: "destPath",
        visible: true,
        description: "test1",
        authorDescription: "test1",
        materials: ["paint", "canvas"],
      });
      await product.save();

      const mockFindByIdAndDelete = jest.spyOn(
        ProductModel,
        "findByIdAndDelete"
      );
      mockFindByIdAndDelete.mockImplementationOnce(() => {
        throw new Error("Internal Server Error");
      });

      const res = await request(app).delete(`/admin/product/${product._id}`);

      expect(res.status).toEqual(500);
      expect(res.body.error).toEqual("Internal Server Error");

      mockFindByIdAndDelete.mockRestore();
    });
  });
});
