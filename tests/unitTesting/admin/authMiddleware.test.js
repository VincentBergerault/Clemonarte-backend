const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../../../dist/server.js").default;

const COOKIE_NAME = process.env.COOKIE_NAME;
process.env.NODE_ENV = "!test";

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

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

    it("should return 401 for missing token", async () => {
      const jwtVerifySpy = jest
        .spyOn(jwt, "verify")
        .mockImplementation((token, secret, callback) =>
          callback(null, { data: { userID: 1, username: testusername } })
        );
      await request(app)
        .get("/admin/product")
        .set("Cookie", `${COOKIE_NAME}=valid_token`)
        .then((response) => {
          expect(response.status).toBe(200);
        });

      jwtVerifySpy.mockRestore();
    });
  });
});
