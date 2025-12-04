
// src/modules/admin/admin.service.ts
import prisma from "../../utils/prisma";

export const adminService = {
  /* -----------------------------------
     VENDORS
  ------------------------------------*/
  getPendingVendors: async () => {
    return prisma.vendor.findMany({
      where: { status: "PENDING" }
    });
  },

  approveVendor: async (vendorId: string) => {
    return prisma.vendor.update({
      where: { id: vendorId },
      data: { status: "APPROVED" }
    });
  },

  rejectVendor: async (vendorId: string) => {
    return prisma.vendor.update({
      where: { id: vendorId },
      data: { status: "REJECTED" }
    });
  },

  suspendVendor: async (vendorId: string) => {
    return prisma.vendor.update({
      where: { id: vendorId },
      data: { status: "SUSPENDED" }
    });
  },

  /* -----------------------------------
     CATEGORY
  ------------------------------------*/
  createCategory: async (name: string) => {
    return prisma.category.create({ data: { name } });
  },

  updateCategory: async (id: string, name: string) => {
    return prisma.category.update({
      where: { id },
      data: { name }
    });
  },

  deleteCategory: async (id: string) => {
    return prisma.category.delete({ where: { id } });
  },

  /* -----------------------------------
     BRAND
  ------------------------------------*/
  createBrand: async (name: string) => {
    return prisma.brand.create({ data: { name } });
  },

  updateBrand: async (id: string, name: string) => {
    return prisma.brand.update({
      where: { id },
      data: { name }
    });
  },

  deleteBrand: async (id: string) => {
    return prisma.brand.delete({ where: { id } });
  },

  /* -----------------------------------
     MANAGERS
  ------------------------------------*/
  getManagers: async () => {
    return prisma.manager.findMany({
      include: { user: true }
    });
  },

  createManager: async (userid: string, area: string) => {
    return prisma.manager.create({
      data: { userid, area }
    });
  },

  updateManager: async (id: string, area: string) => {
    return prisma.manager.update({
      where: { id },
      data: { area }
    });
  },

  deleteManager: async (id: string) => {
    return prisma.manager.delete({ where: { id } });
  },

  /* -----------------------------------
     ORDERS
  ------------------------------------*/
  getOrders: async () => {
    return prisma.order.findMany({
      include: { user: true, vendor: true }
    });
  },

  refundOrder: async (orderid: string) => {
    return prisma.refundsRequest.update({
      where: { orderid },
      data: { status: "COMPLETED" }
    });
  },

  returnOrder: async (orderId: string) => {
    return prisma.returnRequest.update({
      where: { orderId },
      data: { status: "APPROVED" }
    });
  },

  /* -----------------------------------
     COUPONS (not in your model, simple demo)
  ------------------------------------*/
//   createCoupon: async (data: any) => {
//     return prisma.coupon.create({ data });
//   },

//   updateCoupon: async (id: string, data: any) => {
//     return prisma.coupon.update({
//       where: { id },
//       data
//     });
//   },

//   deleteCoupon: async (id: string) => {
//     return prisma.coupon.delete({ where: { id } });
//   },

  /* -----------------------------------
     DELIVERY ASSIGN (Order.deliveryId)
  ------------------------------------*/
  assignDelivery: async (orderId: string, deliveryid: string) => {
    return prisma.order.update({
      where: { id: orderId },
      data: { deliveryid }
    });
  },

  /* -----------------------------------
     REPORTS (Demo version)
  ------------------------------------*/
  getReports: async () => {
    return {
      totalUsers: await prisma.user.count(),
      totalVendors: await prisma.vendor.count(),
      totalOrders: await prisma.order.count()
    };
  },

  getAllVendors: async () => {
    return prisma.vendor.findMany({
      include: { user: true, Wallet: true }
    });
  }
};


