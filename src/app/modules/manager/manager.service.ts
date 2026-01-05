import prisma from "../../utils/prisma"

const getallvendor = async() => {
    const vendor = await prisma.vendor.findMany({
        include: {
            User: true,
            Product: true
        }
    })

    return vendor
}

const approveProduct = async (productid: string) => {
    const products = await prisma.product.update({
        where: {id : productid},
        data: {status: "APPROVED"}
    })

    return products
}


const rejectProduct = async ( productid : string) => {
    const reject = await prisma.product.update({
        where: {id : productid},
        data: {status: "REJECTED"}
    })
    return reject
}

const getVendorPerformance = async ( vendorid : string) => {
    const vendorperformance = await prisma.vendor.findUnique({
        where: {id: vendorid},
        include: {
            Order: true,
            Product: true,
            VendorWallet: true
        }
    })

    return vendorperformance
}

const vendorwarning = async (vendorid: string, body: any ) => {
    const warning = await prisma.vendor.update({
        where: {id: vendorid},
        data: {
            status: "SUSPENDED"
        }
    })

    return warning
}


const assignDeliveryBoy = async( orderid: string, deliveryid: string) => {
    const deliery = await prisma.order.update({
        where: {id: orderid},
        data: {deliveryid}
    })

    return deliery
}

const getorderbymanagerarea = async (manageruserid : string) => {
    const managers = await prisma.manager.findUnique({
        where : {userid: manageruserid},

    })

    if (!managers?.area) return [];

    return prisma.order.findMany({
    where: {
      Vendor: {
        area: managers.area,
      },
    },
    include: { User: true, Vendor: true },
  });
}

const reportOrderIssue = async (orderid: string, issue: string) => {
    const issues = await prisma.order.update({
        where: {id: orderid},
        data: {status: "FAILED"}
    })
    return issues
}

const sendManagerMessage = async(senderid: string, body: any) => {
    const sendmessage = await prisma.chatMessage.create({
        data: {
            senderid,
            receiverid: body.receiverid,
            message: body.message
        }
    })
    return sendmessage
}

const   getManagerChat = async (managerId: string) => {
    // Manager এর সব chat messages fetch
    const messages = await prisma.chatMessage.findMany({
      where: {
        OR: [
          { senderid: managerId },
          { receiverid: managerId },
        ],
      },
      orderBy: { createdat: "asc" },
    });
    return messages;
  }

 const getSupportTickets = async () => {
  return prisma.order.findMany({
    where: { status: "FAILED" },
  });
};


  const getDashboardStats = async (managerId: string) => {
    // Manager এর area খুঁজে বের করা
    const manager = await prisma.manager.findUnique({
      where: { userid: managerId },
    });

    if (!manager) throw new Error("Manager not found");

    const area = manager.area;

    // Orders in manager's area
    const orders = await prisma.order.findMany({
      where: {area: area ?? undefined, },
    });

    // Vendors in manager's area
    const vendors = await prisma.vendor.findMany({
      where: { area },
    });

    // Stats
    const totalOrders = orders.length;
    const totalVendors = vendors.length;
    const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);

    return {
      totalOrders,
      totalVendors,
      totalRevenue,
    };
  }

    const getProductById= async (productId: string) => {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        Category: true,
        Brand: true,
        Vendor: true,
        productimage: true,
      },
    });

    if (!product) throw new Error("Product not found");

    return product;
  }



export const managerservice = {
    getallvendor,
    approveProduct,
    rejectProduct,
    getVendorPerformance,
    vendorwarning,
    assignDeliveryBoy,
    getorderbymanagerarea,
    reportOrderIssue,
    sendManagerMessage,
    getSupportTickets,
    getDashboardStats,
    getProductById,
    getManagerChat
}