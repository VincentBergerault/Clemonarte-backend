const mongoose = require("mongoose");
require("dotenv").config();

const connect = (): void => {
  mongoose.set("strictQuery", false);
  mongoose.connect(process.env.MONGO_URL);

  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", () => {
    console.log("Connected to MongoDB");
  });
};

export default connect;
