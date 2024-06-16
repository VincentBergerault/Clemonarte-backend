import { Router, Request, Response } from "express";
import multer from "multer";
import { storage } from "@/src/config/storage";
import { imageToBlob } from "@/src/config/handleImages";
import ProductModel from "@/src/models/product.model";
import ImageModel from "@/src/models/image.model";
import fs from "fs";

const router: Router = Router();
const upload = multer({ storage });

router.get("/", async (req: Request, res: Response) => {
  try {
    const items = await ProductModel.find();
    res.json(items);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post(
  "/",
  upload.single("image"),
  async (req: Request, res: Response) => {
    const image = req.file.path;

    try {
      const { body } = req;

      const newProduct = new ProductModel({
        ...body,
        src: image,
      });

      await newProduct.save();
      try {
        const imageBlob = await imageToBlob(image);
        const newImage = new ImageModel({
          name: newProduct.name,
          productID: newProduct._id,
          content: imageBlob.blob,
          extension: imageBlob.mimeType,
        });
        await newImage.save();
      } catch (error: any) {
        throw new Error(error.message);
      }
      res.status(201).json(newProduct);
    } catch (error: any) {
      fs.unlinkSync(image);
      res.status(500).json({ error: error.message });
    }
  }
);

// Update an item
router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const updatedProduct = await ProductModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedProduct = await ProductModel.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    fs.unlinkSync(deletedProduct.src);

    res.status(204).json();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
