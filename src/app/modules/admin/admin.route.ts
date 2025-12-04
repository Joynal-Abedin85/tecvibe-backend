// src/modules/admin/admin.route.ts
import { Router } from "express";
import { adminController } from "./admin.controller";
import { auth } from "../../middleware/auth";
import { roleCheck } from "../../middleware/rolecheck";
import { Role } from "@prisma/client";

const router = Router();

// ADMIN ONLY
router.get("/vendors/pending", auth, roleCheck([Role.ADMIN]), adminController.getPendingVendors);
router.put("/vendors/:id/approve", auth, roleCheck([Role.ADMIN]), adminController.approveVendor);
router.put("/vendors/:id/reject", auth, roleCheck([Role.ADMIN]), adminController.rejectVendor);
router.put("/vendors/:id/suspend", auth, roleCheck([Role.ADMIN]), adminController.suspendVendor);

router.post("/categories", auth, roleCheck([Role.ADMIN]), adminController.createCategory);
router.put("/categories/:id", auth, roleCheck([Role.ADMIN]), adminController.updateCategory);
router.delete("/categories/:id", auth, roleCheck([Role.ADMIN]), adminController.deleteCategory);

router.post("/brands", auth, roleCheck([Role.ADMIN]), adminController.createBrand);
router.put("/brands/:id", auth, roleCheck([Role.ADMIN]), adminController.updateBrand);
router.delete("/brands/:id", auth, roleCheck([Role.ADMIN]), adminController.deleteBrand);

router.get("/managers", auth, roleCheck([Role.ADMIN]), adminController.getManagers);
router.post("/managers", auth, roleCheck([Role.ADMIN]), adminController.createManager);
router.put("/managers/:id", auth, roleCheck([Role.ADMIN]), adminController.updateManager);
router.delete("/managers/:id", auth, roleCheck([Role.ADMIN]), adminController.deleteManager);

router.get("/orders", auth, roleCheck([Role.ADMIN]), adminController.getOrders);
router.put("/orders/:id/refund", auth, roleCheck([Role.ADMIN]), adminController.refundOrder);
router.put("/orders/:id/return", auth, roleCheck([Role.ADMIN]), adminController.returnOrder);

// router.post("/coupons", auth, roleCheck([Role.ADMIN]), adminController.createCoupon);
// router.put("/coupons/:id", auth, roleCheck([Role.ADMIN]), adminController.updateCoupon);
// router.delete("/coupons/:id", auth, roleCheck([Role.ADMIN]), adminController.deleteCoupon);

router.post("/delivery/assign", auth, roleCheck([Role.ADMIN]), adminController.assignDelivery);

router.get("/reports", auth, roleCheck([Role.ADMIN]), adminController.getReports);
router.get("/vendors", auth, roleCheck([Role.ADMIN]), adminController.getAllVendors);

export const adminroute =  router;
