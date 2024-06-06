import { Router } from "express";
import adminAuthRoutes from "@/src/controllers/admin/auth";
import adminProductRoutes from "@/src/controllers/admin/product";

import authMiddleware from "@/src/middlewares/auth";

const router: Router = Router();

router.use("/auth", adminAuthRoutes);
router.use("/product", authMiddleware, adminProductRoutes);

export default router;
