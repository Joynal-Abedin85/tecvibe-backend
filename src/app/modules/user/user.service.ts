import prisma from "../../utils/prisma"

const getprofile = async (userId: string) => {
    const user = prisma.user.findUnique({
        where: {id: userId},
        select: {id: true, name: true, email: true, role: true}
    })
    return user
}

const updateprofile = async(userId: string, data : any) => {
    const update = prisma.user.update({
        where: {id: userId},
        data
    })

    return update
}

// order service 

const getorder = async(userId: string ) => {
    const order = prisma.order.findMany({
        where: {id: userId},
        orderBy: {createdat: "desc"}
    })
    return order
}


const getorderbyid = async( id: string) => {
    const orderbyid = prisma.order.findUnique({
        where: { id }
    })
    return orderbyid
}


const createorder = async (
  userid: string,
  data: {
    vendorid: string;
    deliveryid?: string;
    total: number;
    area: string;
    items: {
      productid: string;
      quantity: number;
      price: number;
    }[];
  }
) => {
  const { vendorid, deliveryid, total, items,area } = data;

  const order = await prisma.order.create({
    data: {
      userid,
      vendorid,
      area,
      deliveryid: deliveryid || null,
      total,

      items: {
        create: items.map((item) => ({
          quantity: item.quantity,
          price: item.price,

          product: {
            connect: { id: item.productid }
          }
        }))
      }
    },
    include: {
      items: true,
    }
  });

  return order;
};


const trackingorder = async(orderid: string) => {
    const track = await prisma.order.findUnique({
        where: {id: orderid},
        select: {
            id: true,
            status: true,
        }
    })

    if (!track) throw new Error("Order not found");

    return track
}

// cart service 

const addtocart = async(userid: string, data: any ) => {
    const item = prisma.cart.create({
        data: {
            userid,
            ...data
        }
    })

    return item
}

const getcart = async (userid: string) => {
    const getcart = await prisma.cart.findMany({
        where: {userid}
    })

    return getcart
}


const updateCartItem = async (id: string, data: any) => {
    const update = await prisma.cart.update({
        where: {id},
        data
    })
    return update
}


const deletecartitem = async (id: string) => {
    const deletecart = await prisma.cart.delete({
        where: {id}
    })

    return deletecart
}


// add wishlist 

const addwishlist = async (userid: string, data: any)=> {
    const addlist = await prisma.wishlist.create({
        data: {
            userid,
            ...data
        }
    })

    return addlist
}

const getwishlist = async (userid: string) => {
    const getlist = await prisma.wishlist.findMany({
        where: {userid}
    })
    return getlist
}

const deletewishlist = async (id: string) => {
    const deletewishlist = await prisma.wishlist.delete({
        where: {id}
    })

    return deletewishlist
}

// review 

const addreview = async (userid: string , productid: string, data: any) => {
    const addreview = await prisma.review.create({
        data: {
            userid,
            productid,
            ...data
        }
    })

    return addreview
}

const getreview = async (productid: string) => {
    const getreview = prisma.review.findMany({
        where: {productid}
    })

    return getreview
}

const addQuestion = async (userid: string , productid: string, data: any) => {
    const question = await prisma.question.create({
        data: {
            userid,
            productid,
            ...data
        }
    })

    return question
}

const getQuestions = async (productid: string) => {
    const question = prisma.question.findMany({
        where: {productid}
    })

    return question
}


export const userservice = {
    getprofile,
    updateprofile,
    getorder,
    getorderbyid,
    createorder,
    trackingorder,
    addtocart,
    getcart,
    updateCartItem,
    deletecartitem,
    addwishlist,
    getwishlist,
    deletewishlist,
    addreview,
    getreview,
    addQuestion,
    getQuestions
}