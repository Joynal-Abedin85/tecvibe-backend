import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchasync";
import { userservice } from "./user.service";
import sendResponse from "../../middleware/sendresponse";
import prisma from "../../utils/prisma";

const getprofile = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;

    const user = await userservice.getprofile(userId)

    sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "success  get",
    data: user
  });
})

const updateProfile = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;

    const update = await userservice.updateprofile(userId, req.body)

    sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "success  update",
    data: update
  });
})


// order 

const getOrders = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;

    const order = await userservice.getorder(userId)

    sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "success  get order",
    data: order
  });
})

const getOrderById = catchAsync (async(req: Request, res: Response) => {
    const {id} = req.params
    const getorder = await userservice.getorderbyid(id)

     sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "success  get order",
    data: getorder
  });
})

const createOrder = catchAsync(async(req: Request, res: Response)=> {
    const userid = (req as any).user?.id;
    const order = await userservice.createorder(userid, req.body)

      sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "success  get order",
    data: order
  });
})


const trackOrder = catchAsync(async(req: Request, res: Response)=> {
    const {id} = req.params
    const tracking = userservice.trackingorder(id)

    sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "success  get order",
    data: tracking
  });
})

// cart 

const addToCart = catchAsync(async(req: Request, res: Response)=> {
    const {id} = (req as any).user
    const item = userservice.addtocart(id, req.body)

    sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "success  get order",
    data: item
  });
})

const getCart = catchAsync(async(req: Request, res: Response)=> {
    const {id} = (req as any).user
    const item = userservice.getcart(id)

    sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "success  get order",
    data: item
  });
})

const updateCartItem = catchAsync(async(req: Request, res: Response)=> {
    const {id} = req.params
    const updateitem = userservice.updateCartItem(id, req.body)

    sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "success  get order",
    data: updateitem
  });
})

const deleteCartItem = catchAsync(async(req: Request, res: Response)=> {
    const {id} = req.params
    const deleteitem = userservice.deletecartitem(id)

    sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "success  get order",
    data: deleteitem
  });
})


// wishlist 

const addWishlist = catchAsync(async(req: Request, res: Response)=> {
    const {id} = (req as any).user
    const addwish = userservice.addwishlist(id, req.body)

    sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "success  get order",
    data: addwish
  });
})

const getWishlist = catchAsync(async(req: Request, res: Response)=> {
    const {id} = (req as any).user
    const getwish = userservice.getwishlist(id)

    sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "success  get order",
    data: getwish
  });
})

const deleteWishlistItem = catchAsync(async(req: Request, res: Response)=> {
    const {id} = req.params
    const deletewish = userservice.deletewishlist(id)

    sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "success  get order",
    data: deletewish
  });
})

// review 

const addReview = catchAsync(async(req: Request, res: Response)=> {
    const {id} = req.params
    const {userid} = (req as any).user
    const deletewish = userservice.addreview( userid,id, req.body)

    sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "success  get order",
    data: deletewish
  });
})

const getReviews = catchAsync(async(req: Request, res: Response)=> {
    const {id} = req.params
    const deletewish = userservice.getreview(id)

    sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "success  get order",
    data: deletewish
  });
})


const addQuestion = catchAsync(async(req: Request, res: Response)=> {
    const {id} = req.params
    const {userid} = (req as any).user
    const question = userservice.addQuestion( userid,id, req.body)

    sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "success  get order",
    data: question
  });
})

const getQuestions = catchAsync(async(req: Request, res: Response)=> {
    const {id} = req.params
    const question = userservice.getQuestions(id)

    sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "success  get order",
    data: question
  });
})


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
    getQuestions
}