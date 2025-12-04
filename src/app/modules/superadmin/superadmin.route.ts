import { Router } from "express";
import { superAdminController } from "./superadmin.controller";
import { roleCheck } from "../../middleware/rolecheck";
import { Role } from "@prisma/client";
import { auth } from "../../middleware/auth";

const router = Router();

/** SUPER ADMIN ROUTES */
router.post(
  "/admins",
  auth, roleCheck([Role.SUPER_ADMIN]),
  superAdminController.createAdmin
);

router.put(
  "/roles/:id",
  auth, roleCheck([Role.SUPER_ADMIN]),
  superAdminController.updateRole
);

router.put(
  "/commission",
  auth, roleCheck([Role.SUPER_ADMIN]),
  superAdminController.updateCommission
);

export const superadminroute =  router;
