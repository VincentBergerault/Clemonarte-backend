import express, { Request, Response, Router } from "express";
import ProductModel from "../models/product.model"; // Assuming default export is used in the model
import { Product } from "../utils/types";

const router: Router = express.Router();

// Get all items
router.get("/", async (req: Request, res: Response) => {
  try {
    const items = (await ProductModel.find({})) as Array<Product>;
    items.filter((item) => item.visible === true);
    res.json(items);
  } catch (error: any) {
    // Consider defining a more specific error type
    res.status(500).json({ error: error.message });
  }
});

// Get a specific item by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const item = await ProductModel.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json(item);
  } catch (error: any) {
    // Consider defining a more specific error type
    res.status(500).json({ error: error.message });
  }
});

export default router;
