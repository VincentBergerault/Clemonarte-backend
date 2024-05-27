const request = require("supertest");
const app = require("../../dist/server.js").default;
const ProductModel = require("../../dist/models/product.model.js").default;

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
      const product3 = new ProductModel({
        name: "oeuvre3",
        price: 3,
        src: "src3",
        visible: false,
        description: "aaaa",
        authorDescription: "aaaa",
        materials: ["paint", "canvas"],
      });

      await product1.save();
      await product2.save();
      await product3.save();

      await request(app)
        .get("/api/product")
        .then((response) => {
          expect(response.status).toBe(200);
        });
    });
  });
});
