// src/modules/admin/admin.controller.ts
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchasync";
import { adminService } from "./admin.service";

/* ----------------------------
     VENDORS
  -----------------------------*/
const getPendingVendors = catchAsync(async (req: Request, res: Response) => {
  const vendors = await adminService.getPendingVendors();
  res.json({ success: true, vendors });
});

const approveVendor = catchAsync(async (req: Request, res: Response) => {
  const vendor = await adminService.approveVendor(req.params.id);
  res.json({ success: true, vendor });
});

const rejectVendor = catchAsync(async (req: Request, res: Response) => {
  const vendor = await adminService.rejectVendor(req.params.id);
  res.json({ success: true, vendor });
});

const suspendVendor = catchAsync(async (req: Request, res: Response) => {
  const vendor = await adminService.suspendVendor(req.params.id);
  res.json({ success: true, vendor });
});

/* ----------------------------
     CATEGORY
  -----------------------------*/
const createCategory = catchAsync(async (req: Request, res: Response) => {
  const category = await adminService.createCategory(req.body.name);
  res.json({ success: true, category });
});

  const getCategories= async (req: Request, res: Response) => {
    try {
      const categories = await adminService.getAllCategories();
      res.status(200).json(categories);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error fetching categories" });
    }
  }

const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const category = await adminService.updateCategory(
    req.params.id,
    req.body.name
  );
  res.json({ success: true, category });
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  await adminService.deleteCategory(req.params.id);
  res.json({ success: true, message: "Category deleted" });
});

/* ----------------------------
     BRAND
  -----------------------------*/
const createBrand = catchAsync(async (req: Request, res: Response) => {
  const brand = await adminService.createBrand(req.body.name);
  res.json({ success: true, brand });
});

  const getBrands= async (req: Request, res: Response) => {
    try {
      const brands = await adminService.getAllBrands();
      res.status(200).json(brands);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error fetching brands" });
    }
  }

const updateBrand = catchAsync(async (req: Request, res: Response) => {
  const brand = await adminService.updateBrand(req.params.id, req.body.name);
  res.json({ success: true, brand });
});

const deleteBrand = catchAsync(async (req: Request, res: Response) => {
  await adminService.deleteBrand(req.params.id);
  res.json({ success: true, message: "Brand deleted" });
});

/* ----------------------------
     MANAGERS
  -----------------------------*/
const getManagers = catchAsync(async (req: Request, res: Response) => {
  const managers = await adminService.getManagers();
  res.json({ success: true, managers });
});

 const getManagerById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const manager = await adminService.getManagerById(id);

  if (!manager) {
    return res.status(404).json({
      success: false,
      message: "Manager not found",
    });
  }

  res.json({
    success: true,
    manager,
  });
});


const createManager = catchAsync(async (req: Request, res: Response) => {
  const manager = await adminService.createManager(
    req.body.userId,
    req.body.area
  );
  res.json({ success: true, manager });
});

const updateManager = catchAsync(async (req: Request, res: Response) => {
  const manager = await adminService.updateManager(
    req.params.id,
    req.body.area
  );
  res.json({ success: true, manager });
});

const deleteManager = catchAsync(async (req: Request, res: Response) => {
  await adminService.deleteManager(req.params.id);
  res.json({ success: true, message: "Manager deleted" });
});

/* ----------------------------
     ORDERS
  -----------------------------*/
const getOrders = catchAsync(async (req: Request, res: Response) => {
  const orders = await adminService.getOrders();
  res.json({ success: true, orders });
});

const refundOrder = catchAsync(async (req: Request, res: Response) => {
  const refund = await adminService.refundOrder(req.params.id);
  res.json({ success: true, refund });
});

const returnOrder = catchAsync(async (req: Request, res: Response) => {
  const returned = await adminService.returnOrder(req.params.id);
  res.json({ success: true, returned });
});

/* ----------------------------
     COUPONS
  -----------------------------*/
// const createCoupon = catchAsync(async (req: Request, res: Response) => {
//   const coupon = await adminService.createCoupon(req.body);
//   res.json({ success: true, coupon });
// });

// const updateCoupon = catchAsync(async (req: Request, res: Response) => {
//   const coupon = await adminService.updateCoupon(req.params.id, req.body);
//   res.json({ success: true, coupon });
// });

// const deleteCoupon = catchAsync(async (req: Request, res: Response) => {
//   await adminService.deleteCoupon(req.params.id);
//   res.json({ success: true, message: "Coupon deleted" });
// });

/* ----------------------------
     DELIVERY
  -----------------------------*/
const assignDelivery = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.assignDelivery(
    req.body.orderId,
    req.body.deliveryId
  );
  res.json({ success: true, result });
});

/* ----------------------------
     REPORTS
  -----------------------------*/
const getReports = catchAsync(async (req: Request, res: Response) => {
  const report = await adminService.getReports();
  res.json({ success: true, report });
});

const getAllVendors = catchAsync(async (req: Request, res: Response) => {
  const vendors = await adminService.getAllVendors();
  res.json({ success: true, vendors });
});

export const getVendorByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const result = await adminService.getVendorById(id);

    res.json({
      success: true,
      message: "Vendor retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const adminController = {
  getPendingVendors,
  approveVendor,
  rejectVendor,
  suspendVendor,
  createCategory,
  updateCategory,
  deleteCategory,
  createBrand,
  updateBrand,
  deleteBrand,
  getManagers,
  createManager,
  updateManager,
  deleteManager,
  getOrders,
  refundOrder,
  returnOrder,
//   createCoupon,
//   updateCoupon,
//   deleteCoupon,
  assignDelivery,
  getReports,
  getAllVendors,
  getManagerById,
  getCategories,
  getBrands,
  getVendorByIdController
};
