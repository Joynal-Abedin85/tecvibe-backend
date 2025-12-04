import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchasync";
import { superAdminService } from "./superadmin.service";
import sendResponse from "../../middleware/sendresponse";

export const superAdminController = {
  // Create admin
  createAdmin: catchAsync(async (req: Request, res: Response) => {
    const result = await superAdminService.createAdmin(req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Admin created successfully",
      data: result,
    });
  }),

  // Update role
  updateRole: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { role } = req.body;

    const result = await superAdminService.updateUserRole(id, role);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Role updated successfully",
      data: result,
    });
  }),

  // Update commission
  updateCommission: catchAsync(async (req: Request, res: Response) => {
    const { rate } = req.body;

    const result = await superAdminService.updateCommission(rate);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Commission updated successfully",
      data: result,
    });
  }),
};
