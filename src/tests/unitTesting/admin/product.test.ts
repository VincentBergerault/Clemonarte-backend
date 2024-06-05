import request from "supertest";
import path from "path";
import fs from "fs";
import app from "../../../server";
import ProductModel from "../../../models/product.model";

process.env.NODE_ENV = "test";

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

      await request(app)
        .get("/admin/product")
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(Array.isArray(response.body)).toEqual(true);
          expect(response.body.length).toEqual(2);
          response.body.forEach((item) => {
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
    });
    it("should return error 5xx find didn't work", async () => {
      const errorMessage = "Database error";
      jest.spyOn(ProductModel, "find").mockReturnValue(new Error(errorMessage));

      await request(app)
        .get("/api/product")
        .then((response) => {
          expect(response.status).toEqual(500);
          expect(response.body).toEqual({ error: errorMessage });
        });
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
      let createdImagePath;

      await request(app)
        .post("/admin/product")
        .field("name", productData.name)
        .field("price", productData.price.toString())
        .field("visible", productData.visible)
        .field("description", productData.description)
        .field("authorDescription", productData.authorDescription)
        .field("materials", productData.materials)
        .attach("image", imagePath)
        .then((response) => {
          expect(response.status).toEqual(201);
          expect(response.body).toHaveProperty("_id");
          expect(response.body.name).toEqual(productData.name);
          expect(response.body.price).toEqual(productData.price);
          expect(response.body.src).toBeTruthy();

          createdImagePath = response.body.src;
          expect(fs.existsSync(createdImagePath)).toEqual(true);
        });

      fs.unlinkSync(createdImagePath);
      expect(fs.existsSync(createdImagePath)).toEqual(false);
    });
    // it("should return error 5xx save didn't work", async () => {
    //   jest
    //     .spyOn(ProductModel, "save")
    //     .mockImplementation((cb) => cb(new Error("Invalid token"), null));

    //   await request(app)
    //     .get("/api/product")
    //     .then((response) => {
    //       expect(response.status).toEqual(500);
    //     });
    // });
  });

  describe("PATCH /admin/product", () => {
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

      await request(app)
        .patch(`/admin/product/${item.id}`)
        .send(productData)
        .then((response) => {
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
    });
  });

  describe("DELETE /admin/product/:id", () => {
    it("Should delete element in DB", async () => {
      const sourcePath = path.join(__dirname, "../../assets/rickroll.jpg");
      const publicDir = path.join(__dirname, "../../public");
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

      await request(app)
        .delete(`/admin/product/${item.id}`)
        .then((response) => {
          console.log(response.status);
          expect(response.status).toEqual(204);
          expect(fs.existsSync(destPath)).toEqual(false);
        });
    });
  });
});
