import { Router } from "express";
import { auth } from "../../middleware/auth";
import { roleCheck } from "../../middleware/rolecheck";
import { Role } from "@prisma/client";
import { deliveryController } from "./deliveryboy.controller";

const router = Router();

// Must be logged in as delivery boy
router.use(auth, roleCheck([Role.DELIVERY_BOY]));

router.get("/orders", deliveryController.getOrders);
router.put("/orders/:id/pickup", deliveryController.pickup);
router.put("/orders/:id/status", deliveryController.updateStatus);
// router.post("/orders/:id/proof", deliveryController.uploadProof);
router.put("/orders/:id/location", deliveryController.updateLocation);
router.post("/chat", deliveryController.sendChat);

export const deliveryroute =  router;
