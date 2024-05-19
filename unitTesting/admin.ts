const request = require("supertest");
const app = require("../app"); // Import your Express application

describe("POST /product", () => {
  it("should create a new product and return it", async () => {
    const newProduct = {
      name: "New Product",
      price: 99.99,
    };

    const response = await request(app)
      .post("/product")
      .send(newProduct)
      .expect(201)
      .expect("Content-Type", /json/);

    expect(response.body).toEqual(
      expect.objectContaining({
        name: "New Product",
        price: 99.99,
      })
    );
  });

  it("should handle validation errors", async () => {
    const newProduct = {
      name: "", // Assuming 'name' cannot be empty
    };

    await request(app)
      .post("/product")
      .send(newProduct)
      .expect(500)
      .expect("Content-Type", /json/);
  });
});
