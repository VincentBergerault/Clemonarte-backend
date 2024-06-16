import request from "supertest";
import app from "@/src/server";
import * as users from "@/src/config/users";
import { generateToken } from "@/src/config/authFunctions";

const COOKIE_NAME = process.env.COOKIE_NAME;

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

      const response = await request(app)
        .get("/admin/product")
        .set("Cookie", `${COOKIE_NAME}=invalid_token`);
      expect(response.status).toEqual(401);
      expect(response.body).toHaveProperty("message", "Unauthorized");
    });

    it("should return 401 for valid token but non-existent user", async () => {
      process.env.NODE_ENV = "not-test";

      const userJwt = generateToken({ userID: 0, username: "" });
      jest.spyOn(users, "getUsers").mockImplementation(() => []);

      const response = await request(app)
        .get("/admin/product")
        .set("Cookie", `${COOKIE_NAME}=${userJwt}`);
      expect(response.status).toEqual(401);
      expect(response.body).toHaveProperty("message", "Unauthorized");
    });

    it("should return 200 for valid token and existing user", async () => {
      process.env.NODE_ENV = "not-test";

      const userJwt = generateToken({ userID: 1, username: testusername });
      const mockedUser = [
        {
          id: 1,
          username: testusername,
          password: "hashed_password",
          role: "admin",
        },
      ];
      jest.spyOn(users, "getUsers").mockImplementation(() => mockedUser);

      const response = await request(app)
        .get("/admin/product")
        .set("Cookie", `${COOKIE_NAME}=${userJwt}`);
      expect(response.status).toEqual(200);
    });
  });
});
