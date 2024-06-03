const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../../../dist/server.js").default;
const users = require("../../../dist/config/users.js");

const COOKIE_NAME = process.env.COOKIE_NAME;
process.env.NODE_ENV = "!test";

describe("Auth routes", () => {
  const testusername = "testlogin";

  describe("Test Auth Middleware", () => {
    it("should return 401 for missing token", async () => {
      await request(app)
        .get("/admin/product")
        .then((response) => {
          expect(response.status).toBe(401);
          expect(response.body).toHaveProperty("message", "Unauthorized");
        });
    });

    it("should return 401 for invalid token", async () => {
      const jwtVerifySpy = jest
        .spyOn(jwt, "verify")
        .mockImplementation((token, secret, callback) =>
          callback(new Error("Invalid token"), null)
        );

      await request(app)
        .get("/admin/product")
        .set("Cookie", `${COOKIE_NAME}=invalid_token`)
        .then((response) => {
          expect(response.status).toBe(401);
          expect(response.body).toHaveProperty("message", "Unauthorized");
        });

      jwtVerifySpy.mockRestore();
    });

    it("should return 401 for valid token but non-existent user", async () => {
      const jwtVerifySpy = jest
        .spyOn(jwt, "verify")
        .mockImplementation((token, secret, callback) =>
          callback(null, { data: { userID: 1, username: "wrongUser" } })
        );

      const getUsersSpy = jest
        .spyOn(users, "default")
        .mockImplementation(() => []);

      await request(app)
        .get("/admin/product")
        .set("Cookie", `${COOKIE_NAME}=valid_token`)
        .then((response) => {
          expect(response.status).toBe(401);
          expect(response.body).toHaveProperty("message", "Unauthorized");
        });

      getUsersSpy.mockRestore();
      jwtVerifySpy.mockRestore();
    });

    it("should return 200 for valid token and existing user", async () => {
      const jwtVerifySpy = jest
        .spyOn(jwt, "verify")
        .mockImplementation((token, secret, callback) =>
          callback(null, { data: { userID: 1, username: testusername } })
        );

      const getUsersSpy = jest
        .spyOn(users, "default")
        .mockImplementation(() => [
          {
            id: 1,
            username: testusername,
            password: "hashed_password",
            role: "admin",
          },
        ]); // Mock the users to return the expected user

      await request(app)
        .get("/admin/product")
        .set("Cookie", `${COOKIE_NAME}=valid_token`)
        .then((response) => {
          expect(response.status).toBe(200);
        });

      jwtVerifySpy.mockRestore();
      getUsersSpy.mockRestore();
    });
  });
});
