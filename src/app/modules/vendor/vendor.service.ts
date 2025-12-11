import cloudinary from "../../utils/cloudinary";
import prisma from "../../utils/prisma"

const applyvendor = async(userid: string, payload: any) => {

      const exists = await prisma.vendor.findUnique({
    where: { userid },
  });

  if (exists) {
    throw new Error( "You already applied for vendor");
  }
    const apply = await prisma.vendor.create({
        data: {
            userid,
            shopname: payload.shopname,
            area: payload.area
        }
    })
    return apply
}

const getDashboard = async (userid: string) => {
    const dashboard = await prisma.vendor.findUnique({
        where: {userid},
        include: {
            Products: true,
            Orders: true,
            Wallet: {include: {history: true}}
        }
    })

    return dashboard
}

// product 

const createproduct = async(userid: string, payload: any) => {
    const vendor = await prisma.vendor.findUnique({where: {userid}})

    const product = await prisma.product.create({
        data: {
            vendorid: vendor!.id,
            ...payload
        }
    }) 

    return product
}


const updateproduct = async (id : string, payload: any  ) => {
    const updatep = await prisma.product.update({
        where: {id } ,
        data: payload
    })

    return updatep
}

const deleteProduct = async(id: string) => {
    const deletep = await prisma.product.delete({
        where: {id}
    })

    return deletep
}

// add product image 



export const uploadProductImages = async (productId: string, files: Express.Multer.File[]) => {
  
  const uploadedImages = [];

  for (const file of files) {
    const upload = await cloudinary.uploader.upload(file.path, {
      folder: "products",
    });

    const saved = await prisma.productimage.create({
      data: {
        productid: productId,
        url: upload.secure_url,
      },
    });

    uploadedImages.push(saved);
  }

  return uploadedImages;
};


// stock 
const updatestock = async (id: string, stock: number) => {
    const stocks = await prisma.product.update({
        where: {id},
        data: {stock}
    })

    return stocks
}

// offer 

const createoffer = async( productid: string, payload: any ) => {
    const offers = await prisma.product.update({
        where: {id: productid},
        data: {...payload}
    })

    return offers
}

// orders 

const getorder = async (userid: string) => {
    const vendor = await prisma.vendor.findUnique({where: {userid}})

    const vendors = await prisma.order.findMany({
        where: {vendorid: vendor!.id},
        include: {items: true, user: true}
    })

    return vendors
}

const updateorder = async (id: string, payload: any ) => {
    const updateo = await prisma.order.update({
        where: {id},
        data: payload
    })

    return updateo
}


const updateOrderStatus = async(id: string , status: any) =>{
    const statuss = await prisma.order.update({
        where: {id},
        data: {status}
    })

    return statuss
}

// returns 

const getReturns = async(userid : string) => {
    const vendor = await prisma.vendor.findUnique({where: {userid}})

    const returms = await prisma.returnRequest.findMany({
        where: {
            order: {
                vendorid: vendor!.id,
            }
        }
    })
    return returms
}

const updatereturn = async (id: string, status: any ) => {
    const updatestatus = await prisma.returnRequest.update({
        where: {id},
        data: {status}
    })

    return updatestatus
}

// refunds 

const getRefunds = async (userid: string) => {
    const refunds = await prisma.vendor.findUnique({where: {userid}})

    const getrefund = await prisma.refundsRequest.findMany({
        where: {
            order: {
                vendorid: refunds!.id
            }
        }
    })

    return getrefund
}

// sales report 

const getsales = async (userid: string) => {
    const vendor = await prisma.vendor.findUnique({where: {userid}})

    const sales = await prisma.order.findMany({
        where: {
            vendorid: vendor!.id,
            status: "DELIVERED"
        }
    })

    return sales
}

const getrevenue = async (userid: string) => {
    const vendor = await prisma.vendor.findUnique({where: {userid}})

    const revenue = await prisma.order.findMany({
        where: {
            vendorid: vendor!.id,
            status: "DELIVERED"
        }
    })

    const totalrevenue = revenue.reduce((sum, o) => sum + o.total , 0)

    return {totalrevenue}
}

const getinventorystatus = async (userid: string) => {
  const vendor = await prisma.vendor.findUnique({where: {userid}})

  const inventory = await prisma.product.findMany({
    where: {verdorid: vendor!.id},
    select: {
        name: true,
        stock: true,
        status: true
    }
  })

  return inventory

}

const getorderperformance = async (userid: string) => {
    const vendor = await prisma.vendor.findUnique({where: {userid}})

    const performane = await prisma.order.groupBy({
        by: ["status"],
        where: {vendorid: vendor!.id},
        _count: true
    })

    return performane
}

const getchats = async (userid: string) => {
    const vendor = await prisma.vendor.findUnique({where: {userid}})

    const chats = await prisma.chatMessage.findMany({
        where: {
            OR: [
                {senderid: vendor!.userid},
                {receiverid: vendor!.userid}
            ]
        }
    })

    return chats
}






export const vendorservice = {
    applyvendor,
    getDashboard,
    createproduct,
    updateproduct,
    deleteProduct,
    updatestock,
    createoffer,
    getorder,
    updateorder,
    updateOrderStatus,
    getReturns,
    updatereturn,
    getRefunds,
    getsales,
    getrevenue,
    getinventorystatus,
    getorderperformance,
    getchats
}