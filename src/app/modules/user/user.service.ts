import Stripe from "stripe";
import prisma from "../../utils/prisma";
import AppError from "../../middleware/AppError";

const getprofile = async (userId: string) => {
  const user = prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true },
  });
  return user;
};

const updateprofile = async (userId: string, data: any) => {
  const update = prisma.user.update({
    where: { id: userId },
    data,
  });

  return update;
};

// order service

const getorder = async (userid: string) => {
  return prisma.order.findMany({
    where: { userid }, // ✅ ঠিক
    orderBy: { createdat: "desc" },
    include: {
      OrderItem: {
        include: {
          Product: true,
        },
      },
      Vendor: true,
    },
  });
};

const getorderbyid = async (id: string) => {
  const orderbyid = prisma.order.findUnique({
    where: { id },
  });
  return orderbyid;
};

// user.service.ts
const createorder = async (
  userid: string,
  data: {
    vendorid: string;
    deliveryid?: string;
    total: number;
    area: string;
    address: string;
    items: {
      productid: string;
      quantity: number;
      price: number;
    }[];
  }
) => {
  const { vendorid, deliveryid, total, items, area, address } = data;

  return await prisma.$transaction(async (tx) => {
    // 1️⃣ Stock validation
    for (const item of items) {
      const product = await tx.product.findUnique({
        where: { id: item.productid },
      });

      if (!product) {
        throw new AppError(404, "Product not found");
      }

      if (product.stock < item.quantity) {
        throw new AppError(400, `Insufficient stock for ${product.name}`);
      }
    }

    // 2️⃣ Create Order
    const order = await tx.order.create({
      data: {
        userid,
        vendorid,
        area,
        address,
        deliveryid: deliveryid || null,
        total,
        status: "PENDING",
        OrderItem: {
          create: items.map((item) => ({
            quantity: item.quantity,
            price: item.price,
            productid: item.productid,
          })),
        },
      },
      include: {
        OrderItem: true,
      },
    });

    // 3️⃣ Decrease product stock
    for (const item of items) {
      await tx.product.update({
        where: { id: item.productid },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    // 4️⃣ Clear user cart
    await tx.cart.deleteMany({
      where: {
        userid,
      },
    });

    return order;
  });
};

const trackingorder = async (orderid: string) => {
  const track = await prisma.order.findUnique({
    where: { id: orderid },
    select: {
      id: true,
      status: true,
    },
  });

  if (!track) throw new Error("Order not found");

  return track;
};

// cart service

export const createaddToCart = async (
  userid: string,
  data: { productid: string; quantity: number }
) => {
  const existing = await prisma.cart.findFirst({
    where: {
      userid,
      productid: data.productid,
    },
  });

  if (existing) {
    return prisma.cart.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + data.quantity },
    });
  }

  return prisma.cart.create({
    data: {
      userid,
      productid: data.productid,
      quantity: data.quantity,
    },
  });
};

const getcart = async (userid: string) => {
  return prisma.cart.findMany({
    where: { userid },
    include: {
      Product: {
        include: {
          productimage: true,
        },
      },
    },
  });
};

const updateCartItem = async (id: string, data: any) => {
  const update = await prisma.cart.update({
    where: { id },
    data,
  });
  return update;
};

const deletecartitem = async (id: string) => {
  const deletecart = await prisma.cart.delete({
    where: { id },
  });

  return deletecart;
};

// add wishlist

const addwishlists = async (userid: string, data: any) => {
  const existing = await prisma.wishlist.findFirst({
    where: {
      userid,
      productid: data.productid,
    },
  });

  if (existing) {
    return null;
  }

  return prisma.wishlist.create({
    data: {
      userid,
      productid: data.productid,
    },
  });
};

const getwishlist = async (userid: string) => {
  const getlist = await prisma.wishlist.findMany({
    where: { userid },
    include: {
      Product: true, // ✅ product data আনবে
    },
  });
  return getlist;
};

const deletewishlist = async (id: string) => {
  const deletewishlist = await prisma.wishlist.delete({
    where: { id },
  });

  return deletewishlist;
};

// review

const addreview = async (userid: string, productid: string, data: any) => {
  const addreview = await prisma.review.create({
    data: {
      userid,
      productid,
      ...data,
    },
  });

  return addreview;
};

const getreview = async (productid: string) => {
  const getreview = prisma.review.findMany({
    where: { productid },
  });

  return getreview;
};

const addQuestion = async (userid: string, productid: string, data: any) => {
  const question = await prisma.question.create({
    data: {
      userid,
      productid,
      ...data,
    },
  });

  return question;
};

const getQuestions = async (productid: string) => {
  const question = prisma.question.findMany({
    where: { productid },
  });

  return question;
};

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

export const createPaymentIntentService = async (amount: number) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // taka → paisa
    currency: "bdt",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return paymentIntent;
};

export const userservice = {
  getprofile,
  updateprofile,
  getorder,
  getorderbyid,
  createorder,
  trackingorder,
  // addtocart,
  getcart,
  updateCartItem,
  deletecartitem,
  addwishlists,
  getwishlist,
  deletewishlist,
  addreview,
  getreview,
  addQuestion,
  getQuestions,
};
