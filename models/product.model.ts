import { Schema, model } from "mongoose";

const ProductSchema = new Schema({
  name: { type: String, unique: true },
  price: Number,
  src: String,
});

export const Product = model("Product", ProductSchema);
