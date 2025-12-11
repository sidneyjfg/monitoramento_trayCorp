import { Router } from "express";
import { ProductController } from "./product.controller";

const router = Router();

router.post("/sync", ProductController.sync);

export default router;
