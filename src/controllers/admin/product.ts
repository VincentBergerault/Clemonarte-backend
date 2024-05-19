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

// Add an item
router.post("/product", async (req: Request, res: Response) => {
  try {
    // Create a new product instance using the request body
    const newProduct = new Product(req.body);

    // Save the new product to the database
    await newProduct.save();

    // Send back the newly created product
    res.status(201).json(newProduct);
  } catch (error: any) {
    // Handle errors, for instance if there are validation errors
    res.status(500).json({ error: error.message });
  }
});

// Update an item
router.patch("/product/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Extract the ID from the URL parameters

    // Update the product using the ID and request body
    // The { new: true } option returns the updated document
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedProduct) {
      // If no product was found with the given ID, return a 404 not found error
      return res.status(404).json({ message: "Product not found" });
    }

    // Send back the updated product
    res.json(updatedProduct);
  } catch (error: any) {
    // Handle errors, such as validation errors or internal server errors
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
