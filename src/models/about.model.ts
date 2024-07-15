import { Schema, model, Document } from "mongoose";
import { AboutSection } from "@/src/types/types";

const AboutSchema = new Schema<AboutSection>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String, required: true },
  index: { type: Number, required: true },
});

const AboutModel = model<AboutSection>("About", AboutSchema);

export default AboutModel;
