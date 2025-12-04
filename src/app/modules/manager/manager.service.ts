import prisma from "../../utils/prisma"

const getallvendor = async() => {
    const vendor = await prisma.vendor.findMany({
        include: {
            user: true,
            Products: true
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
            Orders: true,
            Products: true,
            Wallet: true
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
      vendor: {
        area: managers.area,
      },
    },
    include: { user: true, vendor: true },
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

 const getSupportTickets = async () => {
  return prisma.order.findMany({
    where: { status: "FAILED" },
  });
};

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
    getSupportTickets
}