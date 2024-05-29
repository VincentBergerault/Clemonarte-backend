const request = require("supertest");
const app = require("../../../dist/server.js").default;

const COOKIE_NAME = process.env.COOKIE_NAME;

describe("Admin scenario: login, verify token, logout", () => {
  let cookie;
  const testusername = "testlogin";

  it("should login as admin", async () => {
    await request(app)
      .post("/admin/auth/login")
      .send({ username: testusername, password: "testpwd" })
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Logged in!");
        expect(response.headers["set-cookie"]).toBeDefined();
        expect(response.headers["set-cookie"][0]).toContain(`${COOKIE_NAME}=`);
        cookie = response.headers["set-cookie"][0];
      });
  });

  it("should verify the token from the cookie", async () => {
    await request(app)
      .get("/admin/auth/verify-token")
      .set("Cookie", cookie)
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "Token is valid");
        expect(response.body).toHaveProperty("user");
        expect(response.body.user).toHaveProperty("username", testusername);
      });
  });

  it("should log out the user and clear the cookie", async () => {
    await request(app)
      .get("/admin/auth/logout")
      .set("Cookie", cookie)
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "Logged out");

        const cookies = response.headers["set-cookie"];
        expect(cookies).toBeDefined();
        expect(cookies.some((c) => c.includes(`${COOKIE_NAME}=;`))).toBe(true);
        cookie = response.headers["set-cookie"][0];
      });
  });

  it("should try to verify a token but fail", async () => {
    await request(app)
      .get("/admin/auth/verify-token")
      .set("Cookie", cookie)
      .then((response) => {
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message", "Unauthorized");
      });
  });
});
