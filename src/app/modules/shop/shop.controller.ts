import { Request, Response } from "express";
import { ShopService } from "./shop.service";
import { catchAsync } from "../../utils/catchasync";
import sendResponse from "../../middleware/sendresponse";

export const ShopController = {
  getProducts: catchAsync(async (req: Request, res: Response) => {
    const data = await ShopService.getProducts();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Products fetched successfully",
      data,
    });
  }),

  getProductById: catchAsync(async (req: Request, res: Response) => {
    const data = await ShopService.getProductById(req.params.id);
    sendResponse(res, {
        statusCode: 200,
      success: true,
      message: "Product details fetched",
      data,
    });
  }),

  searchProducts: catchAsync(async (req: Request, res: Response) => {
    const q = (req.query.q as string) || "";
    const data = await ShopService.searchProducts(q);
    sendResponse(res, {
        statusCode: 200,
      success: true,
      message: "Search results",
      data,
    });
  }),

  getCategories: catchAsync(async (req: Request, res: Response) => {
    const data = await ShopService.getCategories();
    sendResponse(res, {
        statusCode: 200,
      success: true,
      message: "All categories fetched",
      data,
    });
  }),

  getBrands: catchAsync(async (req: Request, res: Response) => {
    const data = await ShopService.getBrands();
    sendResponse(res, {
        statusCode: 200,
      success: true,
      message: "All brands fetched",
      data,
    });
  }),
};
