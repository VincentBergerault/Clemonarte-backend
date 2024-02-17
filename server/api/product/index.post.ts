import { Product } from "~/server/models/product.model";

interface IRequestBody {
  name: String;
  price: Number;
  type: String;
  src: String;
}

export default defineEventHandler(async (event) => {
  const { name, price, type, src } = await readBody<IRequestBody>(event);

  const newUserData = await Product.create({
    name,
    price,
    type,
    src,
  });

  return {
    id: newUserData._id,
    name: newUserData.name,
  };
});
