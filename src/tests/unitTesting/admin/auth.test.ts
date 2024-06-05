import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../../server";

const COOKIE_NAME = process.env.COOKIE_NAME;

describe("Auth routes", () => {
  const testusername = "testlogin";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /admin/auth/login", () => {
    it("should login successfully with valid credentials", async () => {
      jest.spyOn(jwt, "sign").mockReturnValue("mocked_token");

      await request(app)
        .post("/admin/auth/login")
        .send({ username: testusername, password: "testpwd" })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body).toHaveProperty("message", "Logged in!");
          expect(response.headers["set-cookie"][0]).toContain(
            `${COOKIE_NAME}=mocked_token`
          );
        });
    });

    it("should return 401 for invalid password", async () => {
      await request(app)
        .post("/admin/auth/login")
        .send({ username: testusername, password: "wrongpassword" })
        .then((response) => {
          expect(response.status).toEqual(401);
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
          expect(response.status).toEqual(401);
          expect(response.body).toHaveProperty(
            "message",
            "Invalid credentials"
          );
        });
    });
  });

  describe("GET /verify-token", () => {
    it("should verify token successfully", async () => {
      const mockedUser = { data: { userID: 1, username: testusername } };
      jest
        .spyOn(jwt, "verify")
        .mockImplementation((t, s, cb) => cb(null, mockedUser));

      await request(app)
        .get("/admin/auth/verify-token")
        .set("Cookie", `${COOKIE_NAME}=valid_token`)
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body).toHaveProperty("message", "Token is valid");
          expect(response.body).toHaveProperty("user");
          expect(response.body.user).toHaveProperty("username", testusername);
        });
    });

    it("should return 401 for missing token", async () => {
      await request(app)
        .get("/admin/auth/verify-token")
        .then((response) => {
          expect(response.status).toEqual(401);
          expect(response.body).toHaveProperty("message", "Unauthorized");
        });
    });

    it("should return 401 for invalid token", async () => {
      jest
        .spyOn(jwt, "verify")
        .mockImplementation((t, s, cb) => cb(new Error("Invalid token")));

      await request(app)
        .get("/admin/auth/verify-token")
        .set("Cookie", `${COOKIE_NAME}=invalid_token`)
        .then((response) => {
          expect(response.status).toEqual(401);
          expect(response.body).toHaveProperty("message", "Unauthorized");
        });
    });

    it("should return 401 for invalid token because user not found", async () => {
      const mockedUser = { data: { userID: 999999, username: testusername } };
      jest
        .spyOn(jwt, "verify")
        .mockImplementation((t, s, cb) => cb(null, mockedUser));

      await request(app)
        .get("/admin/auth/verify-token")
        .set("Cookie", `${COOKIE_NAME}=invalid_token`)
        .then((response) => {
          expect(response.status).toEqual(401);
          expect(response.body).toHaveProperty("message", "Unauthorized");
        });
    });
  });

  describe("GET /logout", () => {
    it("should logout successfully", async () => {
      await request(app)
        .get("/admin/auth/logout")
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body).toHaveProperty("message", "Logged out");
          expect(response.headers["set-cookie"][0]).toContain(
            `${COOKIE_NAME}=;`
          );
        });
    });
  });
});
