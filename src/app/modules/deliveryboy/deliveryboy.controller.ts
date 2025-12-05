import { Request, Response } from "express";
import sendResponse from "../../middleware/sendresponse";
import { catchAsync } from "../../utils/catchasync";
import { deliveryService } from "./deliveryboy.service";


export const deliveryController = {

  // 1) Get Assigned Orders
  getOrders: catchAsync(async (req: Request, res: Response) => {
    const deliveryBoyId = (req as any).user.id;

    const orders = await deliveryService.getAssignedOrders(deliveryBoyId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Assigned orders fetched successfully",
      data: orders,
    });
  }),

  // 2) Pickup Order
  pickup: catchAsync(async (req: Request, res: Response) => {
    const deliveryBoyId = (req as any).user.id;
    const { id } = req.params;

    const order = await deliveryService.pickupOrder(id, deliveryBoyId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Order picked successfully",
      data: order,
    });
  }),

  // 3) Update Order Status
  updateStatus: catchAsync(async (req: Request, res: Response) => {
    const deliveryBoyId = (req as any).user.id;
    const { id } = req.params;
    const { status } = req.body;

    const updatedOrder = await deliveryService.updateStatus(id, deliveryBoyId, status);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Order status updated successfully",
      data: updatedOrder,
    });
  }),

  // 4) Upload Proof Image
//   uploadProof: catchAsync(async (req: Request, res: Response) => {
//     const deliveryBoyId = (req as any).user.id;
//     const { id } = req.params;

//     const url = req.file?.path; // e.g. multer upload

//     const updated = await deliveryService.uploadProof(id, deliveryBoyId, url);

//     sendResponse(res, {
//       statusCode: 200,
//       success: true,
//       message: "Delivery proof uploaded successfully",
//       data: updated,
//     });
//   }),

  // 5) Update Live Location
  updateLocation: catchAsync(async (req: Request, res: Response) => {
    const deliveryBoyId = (req as any).user.id;
    const { location } = req.body;

    const updated = await deliveryService.updateLocation(deliveryBoyId, location);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Location updated successfully",
      data: updated,
    });
  }),

  // 6) Chat
  sendChat: catchAsync(async (req: Request, res: Response) => {
    const senderId = (req as any).user.id;
    const { receiverId, message } = req.body;

    const chat = await deliveryService.sendChat(senderId, receiverId, message);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Message sent successfully",
      data: chat,
    });
  })
};
