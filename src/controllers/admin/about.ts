import { Router, Request, Response } from "express";
import AboutModel from "@/src/models/about.model";

const router: Router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const items = await AboutModel.find();
    res.json(items);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { body } = req;
    const newAboutSection = new AboutModel(body);
    await newAboutSection.save();

    res.status(201).json(newAboutSection);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update an item
router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const updatedProduct = await AboutModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "AboutSection not found" });
    }

    res.json(updatedProduct);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
