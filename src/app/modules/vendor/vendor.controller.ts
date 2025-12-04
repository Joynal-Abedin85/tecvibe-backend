import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchasync";
import sendResponse from "../../middleware/sendresponse";
import { vendorservice } from "./vendor.service";

const applyvendor = catchAsync(async (req: Request, res: Response) => {
  const result = await vendorservice.applyvendor(
    (req as any).user.id,
    req.body
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "vendor apply success",
    data: result,
  });
});

const getDashboard = catchAsync(async (req: Request, res: Response) => {
  const result = await vendorservice.getDashboard((req as any).user.id);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "get dashboard success",
    data: result,
  });
});

// product

const createProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await vendorservice.createproduct(
    (req as any).user.id,
    req.body
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "create product success",
    data: result,
  });
});

const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await vendorservice.updateproduct(
    (req as any).params.id,
    req.body
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "update product success",
    data: result,
  });
});

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await vendorservice.deleteProduct((req as any).params.id);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "delete product success",
    data: result,
  });
});

// add product image neded

// stock
const updateStock = catchAsync(async (req: Request, res: Response) => {
  const result = await vendorservice.updatestock(
    (req as any).params.id,
    req.body.stock
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "update stock  success",
    data: result,
  });
});

// offer

const createOffer = catchAsync(async (req: Request, res: Response) => {
  const result = await vendorservice.createoffer(
    (req as any).params.id,
    req.body
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "create offer success",
    data: result,
  });
});

const getOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await vendorservice.getorder((req as any).user.id);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "get orders success",
    data: result,
  });
});

const updateOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await vendorservice.updateorder(req.params.id, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "update order success",
    data: result,
  });
});

const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await vendorservice.updateOrderStatus(
    req.params.id,
    req.body.status
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "update order status success",
    data: result,
  });
});

// returns 

const getReturns = catchAsync(async (req: Request, res: Response) => {
  const result = await vendorservice.getReturns(
    (req as any).user.id
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "get returns success",
    data: result,
  });
});

const updateReturnStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await vendorservice.updatereturn(
    req.params.id,
    req.body.status
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "update return status  success",
    data: result,
  });
});

// refunds 

const getrefund = catchAsync(async (req: Request, res: Response) => {
  const result = await vendorservice.getRefunds(
    (req as any).user.id
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "get refund success",
    data: result,
  });
});

// sates report  

const getSales = catchAsync(async (req: Request, res: Response) => {
  const result = await vendorservice.getsales(
    (req as any).user.id
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "get sales success",
    data: result,
  });
});

const getRevenue = catchAsync(async (req: Request, res: Response) => {
  const result = await vendorservice.getrevenue(
    (req as any).user.id
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "get revenue success",
    data: result,
  });
});

const getInventoryStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await vendorservice.getinventorystatus(
    (req as any).user.id
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "get inventory status  success",
    data: result,
  });
});

const getOrderPerformance = catchAsync(async (req: Request, res: Response) => {
  const result = await vendorservice.getorderperformance(
    (req as any).user.id
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "get order performance  success",
    data: result,
  });
});

const getChats = catchAsync(async (req: Request, res: Response) => {
  const result = await vendorservice.getchats(
    (req as any).user.id
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "get chats  success",
    data: result,
  });
});


export const vendorController = {
  applyvendor,
  getDashboard,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  createOffer,
  getOrders,
  updateOrder,
  updateOrderStatus,
  getReturns,
  updateReturnStatus,
  getrefund,
  getSales,
  getRevenue,
  getInventoryStatus,
  getOrderPerformance,
  getChats
};
