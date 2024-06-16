import { Router, Request, Response } from "express";
import ImageModel from "@/src/models/image.model";

const router: Router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const items = await ImageModel.find();
    res.json(items);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
