import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
// const { login, isAuthenticated } = require("./Middleware/Authentication");
require("dotenv").config();

import productRoutes from "./controllers/product";
import contactRoutes from "./controllers/contact";
import adminRoutes from "./controllers/admin.routes";

const CLEMONARTE_FRONTEND_URL = process.env.CLEMONARTE_FRONTEND_URL;

const app = express();
app.use(express.json());
app.use(morgan("combined"));
app.use(cookieParser());
app.use(
  cors({
    origin:
      process.env.DEV === "true"
        ? ["http://localhost:8090"]
        : CLEMONARTE_FRONTEND_URL,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
app.use(express.static("../public"));

app.use("/admin", adminRoutes);

app.use("/api/product", productRoutes);
app.use("/api/contact", contactRoutes);
app.get("/healthcheck", (req, res) => {
  res.json({ message: "OK - " + Date.now() });
});

export default app;
