import { Router } from "express";
import { createProductController, getProductByIdController, getVendorProductsController, vendorController } from "./vendor.controller";
import { auth } from "../../middleware/auth";
import { upload } from "../../middleware/multer";
import { roleCheck } from "../../middleware/rolecheck";
import { Role } from "@prisma/client";

const router = Router();
// const upload = multer({ dest: "/tmp" }); 


// VENDOR APPLY
router.post("/apply", auth, vendorController.applyvendor);

// DASHBOARD
router.get("/dashboard", auth, vendorController.getDashboard);

// PRODUCT CRUD
router.post(
  "/products",
  auth,
  roleCheck([Role.VENDOR]),
  upload.array("images"),
  createProductController
);
router.get("/products", auth, getVendorProductsController);

router.get("/products/:id", auth, getProductByIdController);

router.put("/products/:id", auth,upload.array("images"),  vendorController.updateProduct);
router.delete("/products/:id", auth, vendorController.deleteProduct);

// PRODUCT IMAGES
// router.post("/products/:id/images", auth,  upload.array("images", 5),   // multiple image support
//   vendorController.uploadImages);

// STOCK UPDATE
router.put("/products/:id/stock", auth, vendorController.updateStock);

// OFFER / DISCOUNT
router.post("/products/:id/offer", auth, vendorController.createOffer);

// ORDER MANAGEMENT
router.get("/orders", auth, vendorController.getOrders);
router.get("/orders/:id", auth, vendorController.getOrderById);

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
