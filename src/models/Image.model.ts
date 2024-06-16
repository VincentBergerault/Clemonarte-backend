import { Schema, model } from "mongoose";
import { Image } from "@/src/types/types";

const ImageSchema = new Schema<Image>({
  name: { type: String, required: true, unique: true },
  productID: { type: String, required: true },
  content: { type: String, required: true },
  extension: { type: String, required: true },
});

const ImageModel = model<Image>("Image", ImageSchema);

export default ImageModel;
