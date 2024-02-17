const express = require("express");
const cors = require("cors");
var history = require("connect-history-api-fallback");

const cookieParser = require("cookie-parser");
const index = require("./indexDB");
// const { login, isAuthenticated } = require("./Middleware/Authentication");
require("dotenv").config();

// const itemRoutes = require("./Controllers/Item");
// const taskRoutes = require("./Controllers/Task");

// const path = __dirname + "/app/views/";

index();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin:
      process.env.VUE_APP_DEV === "true"
        ? ["http://localhost:5010", "http://localhost:8080"]
        : "https://" + process.env.VUE_APP_TODO_URL,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.get("/healthcheck", (req, res) => {
  res.json({ message: "OK - " + Date.now() });
});

app.listen(process.env.BACK_END_PORT, () => {
  console.log(
    `Server started on http://localhost:${process.env.BACK_END_PORT}`
  );
});
