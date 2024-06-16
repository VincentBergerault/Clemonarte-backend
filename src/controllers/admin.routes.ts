import { Router } from "express";
import adminAuthRoutes from "@/src/controllers/admin/auth";
import adminProductRoutes from "@/src/controllers/admin/product";
import adminImageRoutes from "@/src/controllers/admin/image";

import authMiddleware from "@/src/middlewares/auth";

const router: Router = Router();

router.use("/auth", adminAuthRoutes);
router.use("/product", authMiddleware, adminProductRoutes);
router.use("/image", authMiddleware, adminImageRoutes);

export default router;
