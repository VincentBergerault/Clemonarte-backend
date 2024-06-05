import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../../server";
import users from "../../../config/users";

const COOKIE_NAME = process.env.COOKIE_NAME;
process.env.NODE_ENV = "!test";

describe("Auth routes", () => {
  const testusername = "testlogin";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Test Auth Middleware", () => {
    it("should return 401 for missing token", async () => {
      await request(app)
        .get("/admin/product")
        .then((response) => {
          expect(response.status).toEqual(401);
          expect(response.body).toHaveProperty("message", "Unauthorized");
        });
    });

    it("should return 401 for invalid token", async () => {
      jest
        .spyOn(jwt, "verify")
        .mockImplementation((t, s, cb) => cb(new Error("Invalid token"), null));

      await request(app)
        .get("/admin/product")
        .set("Cookie", `${COOKIE_NAME}=invalid_token`)
        .then((response) => {
          expect(response.status).toEqual(401);
          expect(response.body).toHaveProperty("message", "Unauthorized");
        });
    });

    it("should return 401 for valid token but non-existent user", async () => {
      const mockedUser = { data: { userID: 1, username: "wrongUser" } };
      jest
        .spyOn(jwt, "verify")
        .mockImplementation((t, s, cb) => cb(null, mockedUser));
      jest.spyOn(users).mockImplementation(() => []);

      await request(app)
        .get("/admin/product")
        .set("Cookie", `${COOKIE_NAME}=valid_token`)
        .then((response) => {
          expect(response.status).toEqual(401);
          expect(response.body).toHaveProperty("message", "Unauthorized");
        });
    });

    it("should return 200 for valid token and existing user", async () => {
      const mockedUser = { data: { userID: 1, username: testusername } };
      jest
        .spyOn(jwt, "verify")
        .mockImplementation((t, s, cb) => cb(null, mockedUser));

      jest.spyOn(users, "default").mockImplementation(() => [
        {
          id: 1,
          username: testusername,
          password: "hashed_password",
          role: "admin",
        },
      ]);

      await request(app)
        .get("/admin/product")
        .set("Cookie", `${COOKIE_NAME}=valid_token`)
        .then((response) => {
          expect(response.status).toEqual(200);
        });
    });
  });
});
