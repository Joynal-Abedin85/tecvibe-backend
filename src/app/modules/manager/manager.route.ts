import { Router } from "express";
import { Role } from "@prisma/client";
import { managercontroler } from "./manager.controller";
import { auth } from "../../middleware/auth";
import { roleCheck } from "../../middleware/rolecheck";


const router = Router();

// Manager Only Routes
router.get("/vendors", auth ,roleCheck([Role.MANAGER]), managercontroler.getallvendor);
router.put("/products/:id/approve", auth,roleCheck([Role.MANAGER]), managercontroler.approveProduct);
router.put("/products/:id/reject", auth,roleCheck([Role.MANAGER]), managercontroler.rejectProduct);

router.get("/vendors/:id/performance", auth,roleCheck([Role.MANAGER]), managercontroler.getVendorPerformance);
router.put("/vendors/:id/warning", auth,roleCheck([Role.MANAGER]), managercontroler.vendorwarning);

router.post("/orders/:id/assign-delivery", auth,roleCheck([Role.MANAGER]), managercontroler.assignDeliveryBoy);
router.get("/orders/area", auth,roleCheck([Role.MANAGER]), managercontroler.getOrdersByManagerArea);
router.put("/orders/:id/issue", auth,roleCheck([Role.MANAGER]), managercontroler.reportOrderIssue);

router.post("/chat", auth,roleCheck([Role.MANAGER]), managercontroler.sendManagerMessage);
router.get("/support-tickets", auth,roleCheck([Role.MANAGER]), managercontroler.getSupportTickets);

export const managerroute = router;
