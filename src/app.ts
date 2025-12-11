import express from "express";
import dotenv from "dotenv";
import productRoutes from "./modules/products/product.routes";
import { ping } from "./controller/ping.controller";

dotenv.config();

const app = express();
app.use(express.json());
app.use("/products", productRoutes);
app.get("/ping", ping);

export { app };
