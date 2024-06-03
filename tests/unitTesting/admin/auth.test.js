const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../../../dist/server.js").default;

const COOKIE_NAME = process.env.COOKIE_NAME;

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("Auth routes", () => {
  const testusername = "testlogin";

  describe("POST /admin/auth/login", () => {
    it("should login successfully with valid credentials", async () => {
      const jwtSignSpy = jest
        .spyOn(jwt, "sign")
        .mockReturnValue("mocked_token");

      await request(app)
        .post("/admin/auth/login")
        .send({ username: testusername, password: "testpwd" })
        .then((response) => {
          expect(response.status).toBe(200);
          expect(response.body).toHaveProperty("message", "Logged in!");
          expect(response.headers["set-cookie"][0]).toContain(
            `${COOKIE_NAME}=mocked_token`
          );
        });

      jwtSignSpy.mockRestore();
    });

    it("should return 401 for invalid password", async () => {
      await request(app)
        .post("/admin/auth/login")
        .send({ username: testusername, password: "wrongpassword" })
        .then((response) => {
          expect(response.status).toBe(401);
          expect(response.body).toHaveProperty(
            "message",
            "Invalid credentials"
          );
        });
    });

    it("should return 401 for invalid user", async () => {
      await request(app)
        .post("/admin/auth/login")
        .send({ username: "wrongUser", password: "wrongpassword" })
        .then((response) => {
          expect(response.status).toBe(401);
          expect(response.body).toHaveProperty(
            "message",
            "Invalid credentials"
          );
        });
    });
  });

  describe("GET /verify-token", () => {
    it("should verify token successfully", async () => {
      const jwtVerifySpy = jest
        .spyOn(jwt, "verify")
        .mockImplementation((token, secret, callback) =>
          callback(null, { data: { userID: 1, username: testusername } })
        );

      await request(app)
        .get("/admin/auth/verify-token")
        .set("Cookie", `${COOKIE_NAME}=valid_token`)
        .then((response) => {
          expect(response.status).toBe(200);
          expect(response.body).toHaveProperty("message", "Token is valid");
          expect(response.body).toHaveProperty("user");
          expect(response.body.user).toHaveProperty("username", testusername);
        });

      jwtVerifySpy.mockRestore();
    });

    it("should return 401 for missing token", async () => {
      await request(app)
        .get("/admin/auth/verify-token")
        .then((response) => {
          expect(response.status).toBe(401);
          expect(response.body).toHaveProperty("message", "Unauthorized");
        });
    });

    it("should return 401 for invalid token", async () => {
      const jwtVerifySpy = jest
        .spyOn(jwt, "verify")
        .mockImplementation((token, secret, callback) =>
          callback(new Error("Invalid token"))
        );

      await request(app)
        .get("/admin/auth/verify-token")
        .set("Cookie", `${COOKIE_NAME}=invalid_token`)
        .then((response) => {
          expect(response.status).toBe(401);
          expect(response.body).toHaveProperty("message", "Unauthorized");
        });

      jwtVerifySpy.mockRestore();
    });

    it("should return 401 for invalid token because user not found", async () => {
      const jwtVerifySpy = jest
        .spyOn(jwt, "verify")
        .mockImplementation((token, secret, callback) =>
          callback(null, { data: { userID: 999999, username: testusername } })
        );

      await request(app)
        .get("/admin/auth/verify-token")
        .set("Cookie", `${COOKIE_NAME}=invalid_token`)
        .then((response) => {
          expect(response.status).toBe(401);
          expect(response.body).toHaveProperty("message", "Unauthorized");
        });

      jwtVerifySpy.mockRestore();
    });
  });

  describe("GET /logout", () => {
    it("should logout successfully", async () => {
      await request(app)
        .get("/admin/auth/logout")
        .then((response) => {
          expect(response.status).toBe(200);
          expect(response.body).toHaveProperty("message", "Logged out");
          expect(response.headers["set-cookie"][0]).toContain(
            `${COOKIE_NAME}=;`
          );
        });
    });
  });
});
