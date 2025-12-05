import express from "express";
import { ShopController } from "./shop.controller";

const router = express.Router();

// PRODUCT ROUTES
router.get("/products", ShopController.getProducts);
router.get("/products/search", ShopController.searchProducts);
router.get("/products/:id", ShopController.getProductById);

// CATEGORY ROUTES
router.get("/categories", ShopController.getCategories);

// BRAND ROUTES
router.get("/brands", ShopController.getBrands);

export const ShopRoutes = router;
