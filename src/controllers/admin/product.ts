import { Router, Request, Response } from "express";
import Product from "../../models/product.model"; // Ensure this is correctly typed in your model file

const router: Router = Router();
// Get all items
router.get("/product", async (req: Request, res: Response) => {
  try {
    const items = await Product.find();
    res.json(items);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a specific item by ID
router.delete("/product/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(204).json(); // 204 No Content
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
