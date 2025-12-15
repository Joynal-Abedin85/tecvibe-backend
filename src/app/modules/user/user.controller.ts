import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchasync";
import { createaddToCart, createPaymentIntentService, userservice } from "./user.service";
import sendResponse from "../../middleware/sendresponse";
import prisma from "../../utils/prisma";

const getprofile = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;

  const user = await userservice.getprofile(userId);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "success  get",
    data: user,
  });
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;

  const update = await userservice.updateprofile(userId, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "success  update",
    data: update,
  });
});

// order

const getOrders = catchAsync(async (req: Request, res: Response) => {
  const userid = (req as any).user.id;

  const orders = await userservice.getorder(userid);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "success get order",
    data: orders,
  });
});


const getOrderById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const getorder = await userservice.getorderbyid(id);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "success  get order by id",
    data: getorder,
  });
});

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const userid = (req as any).user?.id;
  const order = await userservice.createorder(userid, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "success  create order",
    data: order,
  });
});

const trackOrder = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const tracking = userservice.trackingorder(id);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "success  track order",
    data: tracking,
  });
});

// cart

const addToCart = async (req: Request, res: Response) => {
  const userid = (req as any).user.id; // auth middleware থেকে
  const { productid, quantity } = req.body;

  if (!productid || !quantity) {
    return res.status(400).json({
      success: false,
      message: "ProductId and quantity required",
    });
  }

  const item = await createaddToCart(userid, { productid, quantity });

  res.status(201).json({
    success: true,
    message: "Added to cart",
    data: item,
  });
};

const getCart = catchAsync(async (req: Request, res: Response) => {
  const { id } = (req as any).user;

  const item = await userservice.getcart(id); // ✅ await

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "success get cart",
    data: item,
  });
});


const updateCartItem = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateitem = userservice.updateCartItem(id, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "success  update cart item",
    data: updateitem,
  });
});

const deleteCartItem = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const deleteitem = userservice.deletecartitem(id);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "success  delete cart item",
    data: deleteitem,
  });
});

// wishlist

const addWishlist = catchAsync(async (req: Request, res: Response) => {
    const userid = (req as any).user.id; // auth middleware থেকে
  const { productid } = req.body;

  if (!productid) {
    return res.status(400).json({
      success: false,
      message: "ProductId  required",
    });
  }

  const addwish = await userservice.addwishlists(userid, { productid });

  if (!addwish) {
  return res.status(409).json({
    success: false,
    message: "Product already in wishlist",
  });
}


  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "success  add wishlist",
    data: addwish,
  });
});

const getWishlist = catchAsync(async (req: Request, res: Response) => {
  const { id } = (req as any).user;
  const getwish = await userservice.getwishlist(id);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "success  get wishlist",
    data: getwish,
  });
});

const deleteWishlistItem = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const deletewish = userservice.deletewishlist(id);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "success  delete wishlist",
    data: deletewish,
  });
});

// review

const addReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userid } = (req as any).user;
  const deletewish = userservice.addreview(userid, id, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "success  add review",
    data: deletewish,
  });
});

const getReviews = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const deletewish = userservice.getreview(id);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "success  get review",
    data: deletewish,
  });
});

const addQuestion = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userid } = (req as any).user;
  const question = userservice.addQuestion(userid, id, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "success  add question",
    data: question,
  });
});

const getQuestions = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const question = userservice.getQuestions(id);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "success  get questions",
    data: question,
  });
});

export const createReturnRequest = async (req: any, res: Response) => {
  try {
    const { id: orderId } = req.params;
    const { reason } = req.body || { reason: "No reason provided" };

    // Check if order exists and belongs to user
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new Error("Order not found");
    if (order.userid !== req.user.id) throw new Error("Unauthorized");

    // Check if return request already exists
    const existingReturn = await prisma.returnRequest.findUnique({
      where: { orderId },
    });
    if (existingReturn) throw new Error("Return request already exists");

    const returnReq = await prisma.returnRequest.create({
      data: {
        orderId,
        reason,
      },
    });

    res.status(201).json({
      success: true,
      message: "Return request submitted",
      data: returnReq,
    });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Refund status
export const getRefundStatus = async (req: any, res: Response) => {
  try {
    const { id: orderId } = req.params;

    const refund = await prisma.refundsRequest.findUnique({
      where: { orderid: orderId },
    });

    if (!refund) return res.json({ status: "No refund request found" });

    res.json({ status: refund.status });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};


export const createPaymentIntent = async (req: Request, res: Response) => {
  const { amount } = req.body;

  if (!amount) {
    return res.status(400).json({ message: "Amount required" });
  }

  const paymentIntent = await createPaymentIntentService(amount);

  res.json({
    clientSecret: paymentIntent.client_secret,
  });
};


export const usercontroller = {
  getprofile,
  updateProfile,
  getOrders,
  getOrderById,
  createOrder,
  trackOrder,
  addToCart,
  getCart,
  updateCartItem,
  deleteCartItem,
  addWishlist,
  getWishlist,
  deleteWishlistItem,
  addReview,
  getReviews,
  addQuestion,
  getQuestions,
};
