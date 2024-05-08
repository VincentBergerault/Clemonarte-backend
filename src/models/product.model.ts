import { Schema, model, Document } from "mongoose";

interface IProduct extends Document {
  name: string;
  price: number;
  src: string;
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  src: { type: String, required: true },
});

const Product = model<IProduct>("Product", ProductSchema);

export default Product;
