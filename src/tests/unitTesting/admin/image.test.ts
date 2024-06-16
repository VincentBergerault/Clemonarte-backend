import request from "supertest";
import app from "@/src/server";
import ImageModel from "@/src/models/image.model";
import { Image } from "@/src/types/types";

describe("Admin product routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /admin/image", () => {
    it("should return the list of all image", async () => {
      const image = new ImageModel({
        name: "test1",
        productID: "test1",
        content: "test1",
        extension: ".pdf",
      });

      await image.save();

      const response = await request(app).get("/admin/image");
      expect(response.status).toEqual(200);
      expect(Array.isArray(response.body)).toEqual(true);
      expect(response.body.length).toEqual(1);
      response.body.forEach((item: Image) => {
        expect(item).toMatchObject({
          name: expect.any(String),
          productID: expect.any(String),
          content: expect.any(String),
          extension: expect.any(String),
        });
      });
    });

    it("should return error 500 if find operation fails", async () => {
      const errorMessage = "Database error";
      jest.spyOn(ImageModel, "find").mockImplementation(() => {
        throw new Error(errorMessage);
      });

      const response = await request(app).get("/admin/image");
      expect(response.status).toEqual(500);
      expect(response.body).toEqual({ error: errorMessage });
    });
  });
});
