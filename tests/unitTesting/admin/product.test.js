const request = require("supertest");
const app = require("../../../dist/server.js").default;
const ProductModel = require("../../../dist/models/product.model.js").default;
const path = require("path");

process.env.NODE_ENV = "test"; // Set the environment to test

describe("Admin product routes", () => {
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
          expect(response.status).toBe(200);
          expect(Array.isArray(response.body)).toBe(true);
          expect(response.body.length).toBe(2);
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

      // TODO: test if the file is present in public

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
          expect(response.status).toBe(201);
          expect(response.body).toHaveProperty("_id");
          expect(response.body.name).toBe(productData.name);
          expect(response.body.price).toBe(productData.price);
          expect(response.body.src).toBeTruthy();
        });
    });
  });

  // describe("PATCH /admin/product", () => {
  //   it("Should insert a new item in DB and create a file in public directory", async () => {
  //     const productData = {
  //       name: "test1",
  //       price: 2,
  //       visible: false,
  //       description: "test1",
  //       authorDescription: "test1",
  //       materials: ["paint", "canvas"],
  //     };
  //     const imagePath = path.join(__dirname, "../../assets/rickroll.jpg");

  //     await request(app)
  //       .post("/admin/product")
  //       .field("name", productData.name)
  //       .field("price", productData.price.toString())
  //       .field("visible", productData.visible)
  //       .field("description", productData.description)
  //       .field("authorDescription", productData.authorDescription)
  //       .field("materials", productData.materials)
  //       .attach("image", imagePath)
  //       .then((response) => {
  //         expect(response.status).toBe(201);
  //         expect(response.body).toHaveProperty("_id");
  //         expect(response.body.name).toBe(productData.name);
  //         expect(response.body.price).toBe(productData.price);
  //         expect(response.body.src).toBeTruthy();
  //       });
  //   });
  // });
  describe("DELETE /admin/product/:id", () => {
    it("Should delete element in DB", async () => {
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

      // TODO: copy paste the rickroll in public and test if it's deleted after

      await request(app)
        .delete(`/admin/product/${item.id}`)
        .then((response) => {
          expect(response.status).toBe(204);
        });
    });
  });
});
