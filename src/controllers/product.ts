import express, { Request, Response, Router } from "express";
import ProductModel from "../models/product.model"; // Assuming default export is used in the model
import { ClientProduct, Product } from "../utils/types";

const router: Router = express.Router();

type ProductKey = keyof Product;

// Get all items
router.get("/", async (req: Request, res: Response) => {
  try {
    const nonDisplayedValues: ProductKey[] = ["visible", "authorDescription"];
    const items = (await ProductModel.find({}).lean()) as Array<Product>;
    const visibleItems = items.filter((item) => item.visible);

    const ItemForClients = visibleItems.map((item) =>
      Object.keys(item).reduce((newObj, key) => {
        if (!nonDisplayedValues.includes(key as ProductKey)) {
          (newObj as any)[key] = item[key as ProductKey];
        }
        return newObj;
      }, {} as ClientProduct)
    );

    res.json(ItemForClients);
  } catch (error: any) {
    // Consider defining a more specific error type
    res.status(500).json({ error: error.message });
  }
});

export default router;
