const express = require("express");
const cors = require("cors");
var morgan = require('morgan')
//var history = require("connect-history-api-fallback");

const cookieParser = require("cookie-parser");
const indexDB = require("./indexDB");
// const { login, isAuthenticated } = require("./Middleware/Authentication");
require("dotenv").config();

const productRoutes = require("./controllers/product");
// const taskRoutes = require("./Controllers/Task");

// const path = __dirname + "/app/views/";

indexDB();

const app = express();
app.use(express.json());
app.use(morgan("combined"));
app.use(cookieParser());
// app.use(
//   cors({
//     origin:
//       process.env.VUE_APP_DEV === "true"
//         ? ["http://localhost:5010", "http://localhost:8080"]
//         : "https://" + process.env.VUE_APP_TODO_URL,
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//     credentials: true,
//   })
// );

app.use("/api/product", productRoutes);

app.get("/healthcheck", (req, res) => {
  res.json({ message: "OK - " + Date.now() });
});

app.listen(process.env.BACKEND_PORT, () => {
  console.log(
    `Server started on http://localhost:${process.env.BACKEND_PORT}`
  );
});
