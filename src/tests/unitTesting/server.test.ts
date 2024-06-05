import request from "supertest";
import app from "../../server";

describe("HealthCheck route", () => {
  describe("GET /healthcheck", () => {
    it("should return the list of visible product with user parameters only", async () => {
      await request(app)
        .get("/healthcheck")
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body).toHaveProperty("message");
        });
    });
  });
});

describe("CORS configuration", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("should allow requests from localhost in development mode", async () => {
    process.env.DEV = "true";
    process.env.CLEMONARTE_FRONTEND_URL = "http://example.com";

    // Delete cache and Re import to apply new environment variable
    delete require.cache[require.resolve("../../dist/server.js")];
    const app = require("../../dist/server.js").default;

    await request(app)
      .get("/healthcheck")
      .set("Origin", "http://localhost:8090")
      .then((response) => {
        expect(response.headers).toHaveProperty(
          "access-control-allow-origin",
          "http://localhost:8090"
        );
      });

    await request(app)
      .get("/healthcheck")
      .set("Origin", "http://example.com")
      .then((response) => {
        expect(response.headers).not.toHaveProperty(
          "access-control-allow-origin",
          "http://example.com"
        );
      });
  });

  it("should allow requests from frontend in production mode", async () => {
    process.env.DEV = "false";
    process.env.CLEMONARTE_FRONTEND_URL = "http://production.com";

    // Delete cache and Re import to apply new environment variable
    delete require.cache[require.resolve("../../dist/server.js")];
    const app = require("../../dist/server.js").default;

    await request(app)
      .get("/healthcheck")
      .set("Origin", "http://production.com")
      .then((response) => {
        expect(response.headers).toHaveProperty(
          "access-control-allow-origin",
          "http://production.com"
        );
      });

    await request(app)
      .get("/healthcheck")
      .set("Origin", "http://localhost:8090")
      .then((response) => {
        expect(response.headers).not.toHaveProperty(
          "access-control-allow-origin",
          "http://localhost:8090"
        );
      });
  });
});
