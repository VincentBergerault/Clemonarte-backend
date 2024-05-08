import express, { Request, Response, Router } from "express";
import Product from "../models/product.model"; // Assuming default export is used in the model

const router: Router = express.Router();

// Get all items
router.get("/", async (req: Request, res: Response) => {
  try {
    const items = await Product.find({});
    res.json(items);
  } catch (error: any) {
    // Consider defining a more specific error type
    res.status(500).json({ error: error.message });
  }
});

// Get a specific item by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const item = await Product.findById(req.params.id);
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
