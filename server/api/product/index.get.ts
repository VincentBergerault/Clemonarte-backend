import { Product } from "~/server/models/product.model";

export default defineEventHandler(async () => {
  const filter = {};
  const products = await Product.find(filter);

  return { products };
});
