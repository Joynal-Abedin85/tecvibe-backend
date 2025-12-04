import { Router } from "express";
import { vendorController } from "./vendor.controller";
import { auth } from "../../middleware/auth";

const router = Router();

// VENDOR APPLY
router.post("/apply", auth, vendorController.applyvendor);

// DASHBOARD
router.get("/dashboard", auth, vendorController.getDashboard);

// PRODUCT CRUD
router.post("/products", auth, vendorController.createProduct);
router.put("/products/:id", auth, vendorController.updateProduct);
router.delete("/products/:id", auth, vendorController.deleteProduct);

// PRODUCT IMAGES
// router.post("/products/:id/images", auth, vendorController.addProductImages);

// STOCK UPDATE
router.put("/products/:id/stock", auth, vendorController.updateStock);

// OFFER / DISCOUNT
router.post("/products/:id/offer", auth, vendorController.createOffer);

// ORDER MANAGEMENT
router.get("/orders", auth, vendorController.getOrders);
router.put("/orders/:id", auth, vendorController.updateOrder);
router.put("/orders/:id/status", auth, vendorController.updateOrderStatus);

// RETURNS / REFUNDS
router.get("/returns", auth, vendorController.getReturns);
router.put("/returns/:id", auth, vendorController.updateReturnStatus);
router.get("/refunds", auth, vendorController.getrefund);

// ANALYTICS
router.get("/sales", auth, vendorController.getSales);
router.get("/revenue", auth, vendorController.getRevenue);
router.get("/inventory-status", auth, vendorController.getInventoryStatus);
router.get("/order-performance", auth, vendorController.getOrderPerformance);

// CHAT
router.get("/chat", auth, vendorController.getChats);

export const vendorroute =  router;
