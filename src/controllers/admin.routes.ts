import { Router, Request, Response } from "express";
import adminAuthRoutes from "./admin/auth";
import adminProductRoutes from "./admin/product";

import authMiddleware from "../middlewares/auth";

const router: Router = Router();

router.use("/auth", adminAuthRoutes);
router.use("/product", authMiddleware, adminProductRoutes);

export default router;
