import request from "supertest";
import jwt from "jsonwebtoken";
import app from "@/src/server";
import * as users from "@/src/config/users";

const COOKIE_NAME = process.env.COOKIE_NAME!;

jest.mock("jsonwebtoken");
jest.mock("bcrypt");

describe("Auth routes", () => {
  const testusername = "testlogin";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Test Auth Middleware", () => {
    it("should return 401 for missing token", async () => {
      process.env.NODE_ENV = "not-test";
      const response = await request(app).get("/admin/product");
      expect(response.status).toEqual(401);
      expect(response.body).toHaveProperty("message", "Unauthorized");
    });

    it("should return 401 for invalid token", async () => {
      process.env.NODE_ENV = "not-test";
      jest
        .spyOn(jwt, "verify")
        .mockImplementation((t, s, cb) => cb(new Error("Invalid token"), null));

      const response = await request(app)
        .get("/admin/product")
        .set("Cookie", `${COOKIE_NAME}=invalid_token`);
      expect(response.status).toEqual(401);
      expect(response.body).toHaveProperty("message", "Unauthorized");
    });

    it("should return 401 for valid token but non-existent user", async () => {
      process.env.NODE_ENV = "not-test";
      const mockedUser = { data: { userID: 1, username: "wrongUser" } };
      jest.spyOn(jwt, "verify").mockImplementation(() => mockedUser);
      jest.spyOn(users, "getUsers").mockImplementation(() => []);

      const response = await request(app)
        .get("/admin/product")
        .set("Cookie", `${COOKIE_NAME}=valid_token`);
      expect(response.status).toEqual(401);
      expect(response.body).toHaveProperty("message", "Unauthorized");
    });

    it("should return 200 for valid token and existing user", async () => {
      process.env.NODE_ENV = "not-test";
      const mockedUser = { data: { userID: 1, username: testusername } };
      jest.spyOn(jwt, "verify").mockImplementation(() => mockedUser);
      jest.spyOn(users, "getUsers").mockImplementation(() => [
        {
          id: 1,
          username: testusername,
          password: "hashed_password",
          role: "admin",
        },
      ]);

      const response = await request(app)
        .get("/admin/product")
        .set("Cookie", `${COOKIE_NAME}=valid_token`);
      expect(response.status).toEqual(200);
    });
  });
});
