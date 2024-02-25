const { Schema, model } = require("mongoose");

const ProductSchema = new Schema({
  name: { type: String, unique: true },
  price: Number,
  src: String,
});

module.exports = model("Product", ProductSchema);
