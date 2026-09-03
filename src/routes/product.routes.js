import { Router } from "express";
import * as productService from "../services/product.service.js";

const router = Router();

router.get("/", async (req, res) => {
  const products = await productService.getAllProducts();
  res.json(products);
});

router.get("/:slug", async (req, res) => {
  const product = await productService.getProductBySlug(req.params.slug);
  res.json(product);
});

export default router;