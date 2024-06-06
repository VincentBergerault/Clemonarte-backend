import request from "supertest";
import app from "@/src/server";
import { Application } from "express";

describe("HealthCheck route", () => {
  describe("GET /healthcheck", () => {
    it("should return the list of visible product with user parameters only", async () => {
      const response = await request(app).get("/healthcheck");
      expect(response.status).toEqual(200);
      expect(response.body).toHaveProperty("message");
    });
  });
});

describe("CORS configuration", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("should allow requests from localhost in development mode", async () => {
    process.env.NODE_ENV = "development";
    process.env.CLEMONARTE_FRONTEND_URL = "http://example.com";

    // Re-import to apply new environment variable
    const app = (await import("../../server")).default as Application;

    const responseLocalhost = await request(app)
      .get("/healthcheck")
      .set("Origin", "http://localhost:8090");
    expect(responseLocalhost.headers).toHaveProperty(
      "access-control-allow-origin",
      "http://localhost:8090"
    );

    const responseExample = await request(app)
      .get("/healthcheck")
      .set("Origin", "http://example.com");
    expect(responseExample.headers).not.toHaveProperty(
      "access-control-allow-origin",
      "http://example.com"
    );
  });

  it("should allow requests from frontend in production mode", async () => {
    process.env.NODE_ENV = "production";
    process.env.CLEMONARTE_FRONTEND_URL = "http://production.com";

    // Re-import to apply new environment variable
    const app = (await import("../../server")).default as Application;

    const responseProduction = await request(app)
      .get("/healthcheck")
      .set("Origin", "http://production.com");
    expect(responseProduction.headers).toHaveProperty(
      "access-control-allow-origin",
      "http://production.com"
    );

    const responseLocalhost = await request(app)
      .get("/healthcheck")
      .set("Origin", "http://localhost:8090");
    expect(responseLocalhost.headers).not.toHaveProperty(
      "access-control-allow-origin",
      "http://localhost:8090"
    );
  });
});
