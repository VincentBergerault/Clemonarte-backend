import { Router } from "express";
import adminAuthRoutes from "@/controllers/admin/auth";
import adminProductRoutes from "@/controllers/admin/product";
import adminImageRoutes from "@/controllers/admin/image";

import authMiddleware from "@/middlewares/auth";

const router: Router = Router();

router.use("/auth", adminAuthRoutes);
router.use("/product", authMiddleware, adminProductRoutes);
router.use("/image", authMiddleware, adminImageRoutes);

export default router;
