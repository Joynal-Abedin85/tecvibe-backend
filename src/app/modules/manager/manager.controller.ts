import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchasync";
import { managerservice } from "./manager.service";
import sendResponse from "../../middleware/sendresponse";

const getallvendor = catchAsync(async(req: Request, res: Response) => {
    const result = await managerservice.getallvendor()

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "all vendor get",
        data: result
    })
})

const approveProduct = catchAsync(async(req: Request, res: Response) => {
    const result = await managerservice.approveProduct(req.params.id)

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "approve product success",
        data: result
    })
})


const rejectProduct = catchAsync(async(req: Request, res: Response) => {
    const result = await managerservice.rejectProduct(req.params.id)

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "reject product success",
        data: result
    })
})

const getVendorPerformance = catchAsync(async(req: Request, res: Response) => {
    const result = await managerservice.getVendorPerformance(req.params.id)

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "get vendor performance success",
        data: result
    })
})


const vendorwarning = catchAsync(async(req: Request, res: Response) => {
    const result = await managerservice.vendorwarning(req.params.id, req.body)

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "vendor warning success",
        data: result
    })
})

const assignDeliveryBoy = catchAsync(async(req: Request, res: Response) => {
    const result = await managerservice.assignDeliveryBoy(req.params.id, req.body.deliveryid)

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "assign delivery boy success",
        data: result
    })
})



const getOrdersByManagerArea = catchAsync(async(req: Request, res: Response) => {
    const result = await managerservice.getorderbymanagerarea((req as any).user.id)

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "get order manager area success",
        data: result
    })
})

const reportOrderIssue = catchAsync(async(req: Request, res: Response) => {
    const result = await managerservice.reportOrderIssue(req.params.id, req.body.issue)

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "report order success",
        data: result
    })
})

const sendManagerMessage = catchAsync(async(req: Request, res: Response) => {
    const result = await managerservice.sendManagerMessage((req as any).user.id, req.body)

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "send message success",
        data: result
    })
})

const getSupportTickets = catchAsync(async (req: Request, res: Response) => {
  const tickets = await managerservice.getSupportTickets();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Support tickets fetched",
    data: tickets,
  });
});


export const managercontroler = {
    getallvendor,
    approveProduct,
    rejectProduct,
    getVendorPerformance,
    vendorwarning,
    assignDeliveryBoy,
    getOrdersByManagerArea,
    reportOrderIssue,
    sendManagerMessage,
    getSupportTickets
}