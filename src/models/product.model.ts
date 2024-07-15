import { Schema, model, Document } from "mongoose";
import { Product } from "@/types/types";

const ProductSchema = new Schema<Product>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  src: { type: String, required: true },
  visible: { type: Boolean, required: true, default: true },
  description: { type: String, required: true },
  authorDescription: { type: String, required: false },
  materials: [{ type: String, required: true }],
});

const ProductModel = model<Product>("Product", ProductSchema);

export default ProductModel;
