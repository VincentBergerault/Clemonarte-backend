import { Schema, model } from "mongoose";
// import bcrypt from "mongoose-bcrypt";

const ProductSchema = new Schema({
  name: { type: String, unique: true },
  price: Number,
  src: String,
});

export const Product = model("Product", ProductSchema);
// https://medium.com/@flanker72/nuxt3-complex-solutions-database-integration-8df941f0fb82
