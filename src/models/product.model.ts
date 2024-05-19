import { Schema, model, Document } from "mongoose";
import { Product } from "../utils/types";

const ProductSchema = new Schema<Product>({
  name: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  src: { type: String, required: true },
  visible: { type: Boolean, required: true, default: true },
});

const ProductModel = model<Product>("Product", ProductSchema);

export default ProductModel;
