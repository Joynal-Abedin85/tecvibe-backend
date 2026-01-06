// src/modules/admin/admin.service.ts
import prisma from "../../utils/prisma";

export const adminService = {
  /* -----------------------------------
     VENDORS
  ------------------------------------*/
  getPendingVendors: async () => {
    return prisma.vendor.findMany({
      where: { status: "PENDING" },
    });
  },

  approveVendor: async (vendorId: string) => {
  const vendor = await prisma.vendor.update({
    where: { id: vendorId },
    data: { status: "APPROVED" },
    include: { User: true },
  });

  await prisma.user.update({
    where: { id: vendor.userid },
    data: { role: "VENDOR" },
  });

  return vendor;
  },


  rejectVendor: async (vendorId: string) => {
    return prisma.vendor.update({
      where: { id: vendorId },
      data: { status: "REJECTED" },
    });
  },

  suspendVendor: async (vendorId: string) => {
    return prisma.vendor.update({
      where: { id: vendorId },
      data: { status: "SUSPENDED" },
    });
  },

  /* -----------------------------------
     CATEGORY
  ------------------------------------*/
  createCategory: async (name: string) => {
    return prisma.category.create({ data: { name } });
  },

  getAllCategories: async () => {
    return prisma.category.findMany({
      orderBy: { name: "asc" },
    });
  },

  updateCategory: async (id: string, name: string) => {
    return prisma.category.update({
      where: { id },
      data: { name },
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

  getAllBrands: async () => {
    return prisma.brand.findMany({
      orderBy: { name: "asc" },
    });
  },

  updateBrand: async (id: string, name: string) => {
    return prisma.brand.update({
      where: { id },
      data: { name },
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
      include: { User: true },
    });
  },

  getManagerById: async (id: string) => {
    return prisma.manager.findUnique({
      where: { id },
      include: { User: true },
    });
  },

  createManager: async (userid: string, area: string) => {
    await prisma.user.update({
      where: { id: userid },
      data: { role: "MANAGER" },
    });
    const manager = prisma.manager.create({
      data: { userid, area },
    });

    return manager;
  },

  updateManager: async (id: string, area: string) => {
    return prisma.manager.update({
      where: { id },
      data: { area },
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
      include: { User: true, Vendor: true },
    });
  },

  refundOrder: async (orderid: string) => {
    return prisma.refundsRequest.update({
      where: { orderid },
      data: { status: "COMPLETED" },
    });
  },

  returnOrder: async (orderId: string) => {
    return prisma.returnRequest.update({
      where: { orderId },
      data: { status: "APPROVED" },
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
      data: { deliveryid },
    });
  },

  /* -----------------------------------
     REPORTS (Demo version)
  ------------------------------------*/

  getReports: async () => {
    const totalUsers = await prisma.user.count();
    const totalVendors = await prisma.vendor.count();
    const totalOrders = await prisma.order.count();

    // Optional: Monthly Sales & Revenue Trend (frontend chart use করার জন্য)
    const monthlySales = await prisma.order.groupBy({
      by: ["createdat"],
      _sum: { total: true },
    });

    const revenueTrend = monthlySales.map((m) => ({
      month: m.createdat.toISOString().slice(0, 7), // YYYY-MM
      revenue: m._sum.total ?? 0,
    }));

    return {
      totalUsers,
      totalVendors,
      totalOrders,
      monthlySales: revenueTrend, // BarChart
      revenueTrend: revenueTrend, // LineChart
    };
  },

  getAllVendors: async () => {
    return prisma.vendor.findMany({
      include: { User: true, VendorWallet: true },
    });
  },

  getVendorById: async (vendorId: string) => {
    const vendor = await prisma.vendor.findUnique({
      where: {
        id: vendorId,
      },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdat: true,
          },
        },

        Product: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            stock: true,
            status: true,
            updatedat: true,
            productimage: {
              select: {
                id: true,
                url: true,
              },
            },
            Category: {
              select: {
                id: true,
                name: true,
              },
            },
            Brand: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },

        Order: {
          select: {
            id: true,
            total: true,
            status: true,
            area: true,
            createdat: true,
            User: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            OrderItem: {
              select: {
                quantity: true,
                price: true,
                Product: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdat: "desc",
          },
        },

        VendorWallet: true,
      },
    });

    if (!vendor) {
      throw new Error("Vendor not found");
    }

    return vendor;
  },
};
